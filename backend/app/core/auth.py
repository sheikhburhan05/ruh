from typing import Optional, Dict
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt.exceptions import InvalidTokenError
import requests
from functools import lru_cache
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicNumbers
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import base64
import json
from .config import get_settings

security = HTTPBearer()


def ensure_bytes(key: str) -> bytes:
    if isinstance(key, str):
        key = key.encode("utf-8")
    return key


def decode_value(val: str) -> int:
    """Decode JWT base64 value to integer"""
    decoded = base64.urlsafe_b64decode(ensure_bytes(val + "=" * (4 - len(val) % 4)))
    return int.from_bytes(decoded, "big")


def get_public_key(jwk: Dict) -> str:
    """Convert JWK to PEM format"""
    e = decode_value(jwk["e"])
    n = decode_value(jwk["n"])

    # Create RSA public key
    public_numbers = RSAPublicNumbers(e=e, n=n)
    public_key = public_numbers.public_key(backend=default_backend())

    # Get PEM
    pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )

    return pem.decode("utf-8")


@lru_cache()
def get_auth0_public_key() -> Dict:
    """Fetch and cache Auth0 public key for JWT validation"""
    settings = get_settings()
    jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
    response = requests.get(jwks_url)
    return response.json()


def decode_jwt_token(token: str) -> Dict:
    """Decode and validate JWT token"""
    settings = get_settings()
    try:
        # Decode without verification first to get the header
        unverified_header = jwt.get_unverified_header(token)

        # Get the key ID from the header
        kid = unverified_header.get("kid")
        if not kid:
            raise InvalidTokenError("No key ID in token header")

        # Find the matching public key
        jwks = get_auth0_public_key()
        key = None
        for k in jwks["keys"]:
            if k["kid"] == kid:
                key = get_public_key(k)
                break

        if not key:
            raise InvalidTokenError("No matching public key found")

        # Verify and decode the token
        payload = jwt.decode(
            token,
            key=key,
            algorithms=["RS256"],
            audience=settings.AUTH0_AUDIENCE,
            issuer=settings.AUTH0_ISSUER,
            leeway=1296000,  # 15 days in seconds
        )

        return payload

    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Dict:
    """Dependency to get current authenticated user from token"""
    token = credentials.credentials
    payload = decode_jwt_token(token)

    # Extract user info from token
    user = {
        "auth0_id": payload["sub"],  # This is the Auth0 user ID
        "email": payload.get("email"),
    }
    print(user)

    return user

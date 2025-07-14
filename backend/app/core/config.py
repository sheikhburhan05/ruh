from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List, Union
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    # Core Settings
    APP_NAME: str = "Appointment Management System"
    
    # Database Settings
    DATABASE_USERNAME: str
    DATABASE_PASSWORD: str
    DATABASE_HOST: str
    DATABASE_NAME: str
    DATABASE_PORT: str
    DATABASE_URL: str | None = None

    @validator("DATABASE_URL", pre=True)
    def assemble_db_url(cls, v: str | None, values: dict) -> str:
        if v:
            return v
        return f"postgresql+psycopg2://{values['DATABASE_USERNAME']}:{values['DATABASE_PASSWORD']}@{values['DATABASE_HOST']}:{values['DATABASE_PORT']}/{values['DATABASE_NAME']}"
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: List[Union[str, AnyHttpUrl]] = ["*"]  # Allow all origins
    
    # Auth0 Settings
    AUTH0_DOMAIN: str = "dev-mqlgn75f2c8ij4if.us.auth0.com"
    AUTH0_API_AUDIENCE: str = "http://localhost:8000"
    AUTH0_ISSUER: str
    AUTH0_URL: str
    AUTH0_CLIENT_ID: str
    AUTH0_CLIENT_SECRET: str
    AUTH0_AUDIENCE: str

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings() 
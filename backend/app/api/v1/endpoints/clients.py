from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.client import Client, ClientWithAppointments, ClientCreate
from app.schemas.common import PaginatedResponse
from app.services.client_service import ClientService
from app.core.exceptions import ClientException
from app.core.auth import get_current_user

router = APIRouter()

def get_client_service(db: Session = Depends(get_db)) -> ClientService:
    return ClientService(db)

@router.get("/", response_model=PaginatedResponse[Client])
async def get_clients(
    page: int = 1,
    page_size: int = 10,
    search: Optional[str] = None,
    service: ClientService = Depends(get_client_service),
    current_user: Dict = Depends(get_current_user)
):
    """
    Retrieve all clients with pagination and optional search.
    - page: Page number (starts from 1)
    - page_size: Number of items per page
    - search: Search in client name, email, and phone
    """
    try:
        return service.get_clients(
            auth0_id=current_user['auth0_id'],
            page=page,
            page_size=page_size,
            search=search
        )
    except ClientException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{client_id}", response_model=ClientWithAppointments)
async def get_client(
    client_id: int,
    service: ClientService = Depends(get_client_service),
    current_user: Dict = Depends(get_current_user)
):
    """
    Get a specific client by ID.
    """
    try:
        return service.get_client(client_id, current_user['auth0_id'])
    except ClientException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{client_id}/appointments", response_model=PaginatedResponse[Client])
async def get_client_appointments(
    client_id: int,
    page: int = 1,
    page_size: int = 10,
    service: ClientService = Depends(get_client_service),
    current_user: Dict = Depends(get_current_user)
):
    """
    Get all appointments for a specific client with pagination.
    """
    try:
        return service.get_client_appointments(
            client_id=client_id,
            auth0_id=current_user['auth0_id'],
            page=page,
            page_size=page_size
        )
    except ClientException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Client)
async def create_client(
    client: ClientCreate,
    service: ClientService = Depends(get_client_service),
    current_user: Dict = Depends(get_current_user)
):
    """
    Create a new client.
    """
    try:
        return service.create_client(client, current_user['auth0_id'])
    except ClientException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
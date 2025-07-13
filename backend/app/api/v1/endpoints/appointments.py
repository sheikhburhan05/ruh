from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.appointment import (
    Appointment,
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentWithClient,
    AppointmentStatus
)
from app.schemas.common import PaginatedResponse
from app.services.appointment_service import AppointmentService
from datetime import date
from app.core.exceptions import AppointmentException
from app.core.auth import get_current_user

router = APIRouter()

def get_appointment_service(db: Session = Depends(get_db)) -> AppointmentService:
    return AppointmentService(db)

@router.get("/", response_model=PaginatedResponse[AppointmentWithClient])
async def get_appointments(
    page: int = 1,
    page_size: int = 10,
    search: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status: Optional[AppointmentStatus] = None,
    service: AppointmentService = Depends(get_appointment_service),
    current_user: Dict = Depends(get_current_user)
):
    """
    Retrieve all appointments with pagination and filtering.
    - page: Page number (starts from 1)
    - page_size: Number of items per page
    - search: Search in client name
    - start_date: Filter appointments from this date (YYYY-MM-DD)
    - end_date: Filter appointments until this date (YYYY-MM-DD)
    - status: Filter by appointment status
    """
    try:
        return service.get_appointments(
            auth0_id=current_user['auth0_id'],
            page=page,
            page_size=page_size,
            search=search,
            start_date=start_date,
            end_date=end_date,
            status=status
        )
    except AppointmentException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Appointment, status_code=201)
async def create_appointment(
    appointment: AppointmentCreate,
    service: AppointmentService = Depends(get_appointment_service),
    current_user: Dict = Depends(get_current_user)
):
    """
    Create a new appointment.
    """
    try:
        return service.create_appointment(appointment, current_user['auth0_id'])
    except AppointmentException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{appointment_id}", response_model=AppointmentWithClient)
async def get_appointment(
    appointment_id: int,
    service: AppointmentService = Depends(get_appointment_service),
    current_user: Dict = Depends(get_current_user)
):
    """
    Get a specific appointment by ID.
    """
    try:
        return service.get_appointment(appointment_id, current_user['auth0_id'])
    except AppointmentException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{appointment_id}", response_model=Appointment)
async def update_appointment(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    service: AppointmentService = Depends(get_appointment_service),
    current_user: Dict = Depends(get_current_user)
):
    """
    Update an appointment.
    """
    try:
        return service.update_appointment(
            appointment_id,
            appointment_update,
            current_user['auth0_id']
        )
    except AppointmentException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{appointment_id}")
async def delete_appointment(
    appointment_id: int,
    service: AppointmentService = Depends(get_appointment_service),
    current_user: Dict = Depends(get_current_user)
):
    """
    Delete an appointment.
    """
    try:
        return service.delete_appointment(appointment_id, current_user['auth0_id'])
    except AppointmentException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
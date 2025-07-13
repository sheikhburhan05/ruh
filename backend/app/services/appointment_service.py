from typing import List, Optional, Dict
from datetime import datetime, date
from sqlalchemy.orm import Session
from app.db import models
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentStatus
from app.core.exceptions import (
    ClientNotFoundException,
    AppointmentNotFoundException,
    DatabaseOperationException
)

class AppointmentService:
    def __init__(self, db: Session):
        self.db = db

    def get_appointments(
        self,
        auth0_id: str,
        page: int = 1,
        page_size: int = 10,
        search: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        status: Optional[AppointmentStatus] = None,
    ):
        try:
            query = self.db.query(models.Appointment).join(models.Client).filter(
                models.Appointment.auth0_id == auth0_id
            )
            
            if start_date:
                start_datetime = datetime.combine(start_date, datetime.min.time())
                query = query.filter(models.Appointment.time >= start_datetime)
            
            if end_date:
                end_datetime = datetime.combine(end_date, datetime.max.time())
                query = query.filter(models.Appointment.time <= end_datetime)
            
            if status:
                query = query.filter(models.Appointment.status == status)
            
            if search:
                search_term = f"%{search}%"
                query = query.filter(models.Client.name.ilike(search_term))
            
            total = query.count()
            total_pages = (total + page_size - 1) // page_size
            
            # Normalize page numbers
            page = max(1, min(page, total_pages if total_pages > 0 else 1))
            
            appointments = query.offset((page - 1) * page_size).limit(page_size).all()
            
            return {
                "items": appointments,
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_previous": page > 1
            }
        except Exception as e:
            raise DatabaseOperationException("query", str(e))

    def create_appointment(self, appointment: AppointmentCreate, auth0_id: str):
        try:
            client = self.db.query(models.Client).filter(
                models.Client.id == appointment.client_id,
                models.Client.auth0_id == auth0_id
            ).first()
            
            if not client:
                raise ClientNotFoundException(appointment.client_id)

            db_appointment = models.Appointment(
                client_id=client.id,
                time=appointment.time,
                status=appointment.status or AppointmentStatus.SCHEDULED,
                notes=appointment.notes,
                auth0_id=auth0_id
            )
            
            self.db.add(db_appointment)
            self.db.commit()
            self.db.refresh(db_appointment)
            return db_appointment
            
        except ClientNotFoundException:
            raise
        except Exception as e:
            self.db.rollback()
            raise DatabaseOperationException("create", str(e))

    def get_appointment(self, appointment_id: int, auth0_id: str):
        try:
            appointment = self.db.query(models.Appointment).filter(
                models.Appointment.id == appointment_id,
                models.Appointment.auth0_id == auth0_id
            ).first()
            
            if not appointment:
                raise AppointmentNotFoundException(appointment_id)
                
            return appointment
            
        except AppointmentNotFoundException:
            raise
        except Exception as e:
            raise DatabaseOperationException("query", str(e))

    def update_appointment(self, appointment_id: int, appointment_update: AppointmentUpdate, auth0_id: str):
        try:
            db_appointment = self.get_appointment(appointment_id, auth0_id)
            
            appointment_data = appointment_update.model_dump()
            for key, value in appointment_data.items():
                setattr(db_appointment, key, value)
            
            self.db.commit()
            self.db.refresh(db_appointment)
            return db_appointment
            
        except AppointmentNotFoundException:
            raise
        except Exception as e:
            self.db.rollback()
            raise DatabaseOperationException("update", str(e))

    def delete_appointment(self, appointment_id: int, auth0_id: str):
        try:
            db_appointment = self.get_appointment(appointment_id, auth0_id)
            
            self.db.delete(db_appointment)
            self.db.commit()
            return {"message": "Appointment deleted successfully"}
            
        except AppointmentNotFoundException:
            raise
        except Exception as e:
            self.db.rollback()
            raise DatabaseOperationException("delete", str(e)) 
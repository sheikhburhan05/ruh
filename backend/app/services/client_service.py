from typing import Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db import models
from app.schemas.client import ClientCreate
from app.core.exceptions import (
    ClientNotFoundException,
    EmailAlreadyExistsException,
    DatabaseOperationException
)

class ClientService:
    def __init__(self, db: Session):
        self.db = db

    def get_clients(
        self,
        auth0_id: str,
        page: int = 1,
        page_size: int = 10,
        search: Optional[str] = None,
    ):
        """Get all clients with pagination and optional search"""
        try:
            query = self.db.query(models.Client).filter(models.Client.auth0_id == auth0_id)
            
            if search:
                search_term = f"%{search}%"
                query = query.filter(
                    or_(
                        models.Client.name.ilike(search_term),
                        models.Client.email.ilike(search_term),
                        models.Client.phone.ilike(search_term)
                    )
                )
            
            total = query.count()
            total_pages = (total + page_size - 1) // page_size
            
            # Normalize page numbers
            page = max(1, min(page, total_pages if total_pages > 0 else 1))
            
            clients = query.offset((page - 1) * page_size).limit(page_size).all()
            
            return {
                "items": clients,
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_previous": page > 1
            }
        except Exception as e:
            raise DatabaseOperationException("query", str(e))

    def get_client(self, client_id: int, auth0_id: str):
        """Get a specific client by ID"""
        try:
            client = self.db.query(models.Client).filter(
                models.Client.id == client_id,
                models.Client.auth0_id == auth0_id
            ).first()
            
            if not client:
                raise ClientNotFoundException(client_id)
                
            return client
        except ClientNotFoundException:
            raise
        except Exception as e:
            raise DatabaseOperationException("query", str(e))

    def get_client_appointments(
        self,
        client_id: int,
        auth0_id: str,
        page: int = 1,
        page_size: int = 10
    ):
        """Get all appointments for a specific client with pagination"""
        try:
            # Check if client exists and belongs to the user
            client = self.get_client(client_id, auth0_id)
            
            # Get appointments query
            query = self.db.query(models.Appointment).filter(
                models.Appointment.client_id == client_id,
                models.Appointment.auth0_id == auth0_id
            )
            
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
        except ClientNotFoundException:
            raise
        except Exception as e:
            raise DatabaseOperationException("query", str(e))

    def create_client(self, client: ClientCreate, auth0_id: str):
        """Create a new client"""
        try:
            # Check if client with same email already exists for this user
            existing_client = self.db.query(models.Client).filter(
                models.Client.email == client.email,
                models.Client.auth0_id == auth0_id
            ).first()
            
            if existing_client:
                raise EmailAlreadyExistsException(client.email)
            
            # Create new client
            db_client = models.Client(
                name=client.name,
                email=client.email,
                phone=client.phone,
                auth0_id=auth0_id
            )
            
            self.db.add(db_client)
            self.db.commit()
            self.db.refresh(db_client)
            return db_client
            
        except EmailAlreadyExistsException:
            raise
        except Exception as e:
            self.db.rollback()
            raise DatabaseOperationException("create", str(e)) 
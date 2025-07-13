from fastapi import HTTPException, status

class AppointmentException(HTTPException):
    """Base exception for appointment related errors"""
    pass

class ClientNotFoundException(AppointmentException):
    def __init__(self, client_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with id {client_id} not found"
        )

class AppointmentNotFoundException(AppointmentException):
    def __init__(self, appointment_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with id {appointment_id} not found"
        )

class DatabaseOperationException(AppointmentException):
    def __init__(self, operation: str, detail: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database {operation} failed: {detail}"
        )

class ClientException(HTTPException):
    """Base exception for client related errors"""
    pass

class EmailAlreadyExistsException(ClientException):
    def __init__(self, email: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email {email} is already registered"
        ) 
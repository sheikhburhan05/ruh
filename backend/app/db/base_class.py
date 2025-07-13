from typing import Any
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy import Column, String

@as_declarative()
class Base:
    id: Any
    __name__: str
    
    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
    
    # Add auth0_id to all models
    auth0_id = Column(String(255), nullable=False, index=True) 
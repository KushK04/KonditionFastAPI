import uuid
from datetime import date
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class CustomReminder(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    date: date = Field(nullable=False)
    note: Optional[str] = Field(default=None, max_length=255)

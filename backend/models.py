from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone
import uuid


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class StudentBase(BaseModel):
    name: str
    department: str
    student_id: str
    email: Optional[EmailStr] = None
    year: Optional[str] = None
    phone: Optional[str] = None


class StudentCreate(StudentBase):
    pass


class Student(StudentBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "active"  # active | pending | rejected
    photo_path: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PendingEnrollment(StudentBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    snapshot_id: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AttendanceRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    student_name: str
    date: str      # YYYY-MM-DD
    time: str      # HH:MM:SS
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RecognizeRequest(BaseModel):
    image: str  # base64 data URI


class EnrollmentModeRequest(BaseModel):
    enabled: bool

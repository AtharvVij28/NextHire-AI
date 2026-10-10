import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    full_name: str = Field(alias="fullName", min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    target_career: str | None = Field(default=None, alias="targetCareer", max_length=120)
    current_education: str | None = Field(default=None, alias="currentEducation", max_length=160)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    full_name: str = Field(serialization_alias="fullName")
    email: EmailStr
    target_career: str | None = Field(default=None, serialization_alias="targetCareer")
    current_education: str | None = Field(default=None, serialization_alias="currentEducation")
    created_at: datetime = Field(serialization_alias="createdAt")


class AuthResponse(BaseModel):
    success: bool = True
    user: UserPublic

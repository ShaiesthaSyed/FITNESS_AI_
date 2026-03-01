"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─── Auth ─────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    activity_level: Optional[str] = "moderate"
    goal: Optional[str] = "maintain"
    diet_type: Optional[str] = "vegetarian"
    workout_days_per_week: Optional[int] = 4
    medical_conditions: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# ─── User Profile ────────────────────────────────────
class UserProfileResponse(BaseModel):
    id: int
    email: str
    full_name: str
    age: Optional[int]
    gender: Optional[str]
    height_cm: Optional[float]
    weight_kg: Optional[float]
    activity_level: Optional[str]
    goal: Optional[str]
    diet_type: Optional[str]
    workout_days_per_week: Optional[int]
    medical_conditions: Optional[str] = None
    created_at: Optional[datetime]

    # Computed fields
    bmi: Optional[float] = None
    bmr: Optional[float] = None
    tdee: Optional[float] = None
    calorie_target: Optional[float] = None
    protein_target: Optional[float] = None
    fitness_level: Optional[str] = None

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    diet_type: Optional[str] = None
    workout_days_per_week: Optional[int] = None
    medical_conditions: Optional[str] = None


# ─── Progress ────────────────────────────────────────
class ProgressLogRequest(BaseModel):
    weight_kg: Optional[float] = None
    fatigue_level: Optional[int] = None
    notes: Optional[str] = None


class ProgressLogResponse(BaseModel):
    id: int
    weight_kg: Optional[float]
    fatigue_level: Optional[int]
    notes: Optional[str]
    logged_at: datetime

    class Config:
        from_attributes = True


class WorkoutLogRequest(BaseModel):
    workout_day: str
    exercises_completed: int = 0
    total_exercises: int = 0
    duration_minutes: Optional[int] = None
    completed: bool = False


class RecoveryLogRequest(BaseModel):
    sleep_hours: Optional[float] = None
    water_intake_liters: Optional[float] = None
    soreness_level: Optional[int] = None


# ─── AI Coach ────────────────────────────────────────
class AIChatRequest(BaseModel):
    message: str


class AIChatResponse(BaseModel):
    reply: str

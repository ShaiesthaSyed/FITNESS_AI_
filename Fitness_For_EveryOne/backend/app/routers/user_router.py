"""User profile router — view and update profile with computed fitness metrics."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import UserProfileResponse, UserProfileUpdate
from app.auth import get_current_user
from app.engines.fitness_engine import get_full_fitness_profile

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/profile", response_model=UserProfileResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile with computed fitness metrics."""
    fitness = get_full_fitness_profile(current_user)

    return UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        age=current_user.age,
        gender=current_user.gender,
        height_cm=current_user.height_cm,
        weight_kg=current_user.weight_kg,
        activity_level=current_user.activity_level,
        goal=current_user.goal,
        diet_type=current_user.diet_type,
        workout_days_per_week=current_user.workout_days_per_week,
        medical_conditions=current_user.medical_conditions,
        created_at=current_user.created_at,
        bmi=fitness["bmi"],
        bmr=fitness["bmr"],
        tdee=fitness["tdee"],
        calorie_target=fitness["calorie_target"],
        protein_target=fitness["protein_target"],
        fitness_level=fitness["fitness_level"],
    )


@router.put("/profile", response_model=UserProfileResponse)
def update_profile(
    updates: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update user profile fields."""
    update_data = updates.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if value is not None:
            setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    fitness = get_full_fitness_profile(current_user)

    return UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        age=current_user.age,
        gender=current_user.gender,
        height_cm=current_user.height_cm,
        weight_kg=current_user.weight_kg,
        activity_level=current_user.activity_level,
        goal=current_user.goal,
        diet_type=current_user.diet_type,
        workout_days_per_week=current_user.workout_days_per_week,
        medical_conditions=current_user.medical_conditions,
        created_at=current_user.created_at,
        bmi=fitness["bmi"],
        bmr=fitness["bmr"],
        tdee=fitness["tdee"],
        calorie_target=fitness["calorie_target"],
        protein_target=fitness["protein_target"],
        fitness_level=fitness["fitness_level"],
    )

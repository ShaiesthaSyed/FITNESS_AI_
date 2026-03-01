"""Fitness router — workout plan, diet plan, and recovery recommendations."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, WorkoutLog, RecoveryLog
from app.auth import get_current_user
from app.engines.fitness_engine import get_full_fitness_profile
from app.engines.workout_engine import generate_workout_plan
from app.engines.diet_engine import generate_diet_plan
from app.engines.recovery_engine import generate_recovery_plan

router = APIRouter(prefix="/fitness", tags=["Fitness"])


@router.get("/workout-plan")
@router.post("/generate-workout")
def get_workout_plan(current_user: User = Depends(get_current_user)):
    """Generate a personalized workout plan based on user profile."""
    fitness = get_full_fitness_profile(current_user)
    plan = generate_workout_plan(
        goal=current_user.goal or "maintain",
        fitness_level=fitness["fitness_level"],
        workout_days=current_user.workout_days_per_week or 4,
    )
    return plan


@router.get("/diet-plan")
@router.post("/generate-diet")
def get_diet_plan(current_user: User = Depends(get_current_user)):
    """Generate a personalized diet plan based on user profile."""
    fitness = get_full_fitness_profile(current_user)
    plan = generate_diet_plan(
        calorie_target=fitness["calorie_target"],
        protein_target=fitness["protein_target"],
        diet_type=current_user.diet_type or "vegetarian",
        goal=current_user.goal or "maintain",
    )
    return plan


@router.get("/recovery-plan")
@router.post("/generate-recovery")
def get_recovery(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get personalized recovery recommendations."""
    # Count consecutive workout days
    recent_logs = (
        db.query(WorkoutLog)
        .filter(WorkoutLog.user_id == current_user.id, WorkoutLog.completed == True)
        .order_by(WorkoutLog.logged_at.desc())
        .limit(7)
        .all()
    )
    consecutive_days = len(recent_logs)

    # Get latest recovery log
    latest_recovery = (
        db.query(RecoveryLog)
        .filter(RecoveryLog.user_id == current_user.id)
        .order_by(RecoveryLog.logged_at.desc())
        .first()
    )

    fatigue = 5
    sleep = 7.0
    water = 2.0
    soreness = 3

    if latest_recovery:
        sleep = latest_recovery.sleep_hours or 7.0
        water = latest_recovery.water_intake_liters or 2.0
        soreness = latest_recovery.soreness_level or 3

    plan = generate_recovery_plan(
        consecutive_workout_days=consecutive_days,
        fatigue_level=fatigue,
        sleep_hours=sleep,
        water_intake=water,
        soreness_level=soreness,
    )
    return plan

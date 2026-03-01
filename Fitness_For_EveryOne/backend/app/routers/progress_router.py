"""Progress router — log progress and get analytics."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, ProgressLog, WorkoutLog, RecoveryLog
from app.schemas import ProgressLogRequest, ProgressLogResponse, WorkoutLogRequest, RecoveryLogRequest
from app.auth import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.post("/log")
def log_progress(
    req: ProgressLogRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log daily progress (weight, fatigue, notes)."""
    log = ProgressLog(
        user_id=current_user.id,
        weight_kg=req.weight_kg,
        fatigue_level=req.fatigue_level,
        notes=req.notes,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {"message": "Progress logged successfully", "id": log.id}


@router.post("/workout-log")
def log_workout(
    req: WorkoutLogRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log a completed workout."""
    log = WorkoutLog(
        user_id=current_user.id,
        workout_day=req.workout_day,
        exercises_completed=req.exercises_completed,
        total_exercises=req.total_exercises,
        duration_minutes=req.duration_minutes,
        completed=req.completed,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {"message": "Workout logged successfully", "id": log.id}


@router.post("/recovery-log")
def log_recovery(
    req: RecoveryLogRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log recovery data (sleep, water, soreness)."""
    log = RecoveryLog(
        user_id=current_user.id,
        sleep_hours=req.sleep_hours,
        water_intake_liters=req.water_intake_liters,
        soreness_level=req.soreness_level,
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {"message": "Recovery data logged successfully", "id": log.id}


@router.get("/analytics")
def get_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get progress analytics — weight trend, streaks, consistency."""
    now = datetime.utcnow()
    thirty_days_ago = now - timedelta(days=30)

    # Weight trend (last 30 days)
    weight_logs = (
        db.query(ProgressLog)
        .filter(
            ProgressLog.user_id == current_user.id,
            ProgressLog.weight_kg.isnot(None),
            ProgressLog.logged_at >= thirty_days_ago,
        )
        .order_by(ProgressLog.logged_at.asc())
        .all()
    )

    weight_trend = [
        {
            "date": log.logged_at.strftime("%b %d"),
            "weight": log.weight_kg,
        }
        for log in weight_logs
    ]

    # Workout consistency (last 30 days)
    workout_logs = (
        db.query(WorkoutLog)
        .filter(
            WorkoutLog.user_id == current_user.id,
            WorkoutLog.logged_at >= thirty_days_ago,
        )
        .order_by(WorkoutLog.logged_at.asc())
        .all()
    )

    total_workouts = len(workout_logs)
    completed_workouts = len([w for w in workout_logs if w.completed])

    # Weekly consistency map
    weekly_data = {}
    for log in workout_logs:
        week_key = log.logged_at.strftime("Week %U")
        if week_key not in weekly_data:
            weekly_data[week_key] = 0
        if log.completed:
            weekly_data[week_key] += 1

    consistency = [{"week": k, "workouts": v} for k, v in weekly_data.items()]

    # Current streak
    streak = _calculate_streak(workout_logs)

    # Fatigue trend
    fatigue_logs = (
        db.query(ProgressLog)
        .filter(
            ProgressLog.user_id == current_user.id,
            ProgressLog.fatigue_level.isnot(None),
            ProgressLog.logged_at >= thirty_days_ago,
        )
        .order_by(ProgressLog.logged_at.asc())
        .all()
    )

    fatigue_trend = [
        {"date": log.logged_at.strftime("%b %d"), "fatigue": log.fatigue_level}
        for log in fatigue_logs
    ]

    return {
        "weight_trend": weight_trend,
        "consistency": consistency,
        "streak": streak,
        "total_workouts": total_workouts,
        "completed_workouts": completed_workouts,
        "completion_rate": round(completed_workouts / max(total_workouts, 1) * 100),
        "fatigue_trend": fatigue_trend,
    }


def _calculate_streak(workout_logs: list) -> dict:
    """Calculate current workout streak from logs."""
    if not workout_logs:
        return {"current": 0, "best": 0}

    completed = [log for log in workout_logs if log.completed]
    if not completed:
        return {"current": 0, "best": 0}

    # Sort by date
    dates = sorted(set(log.logged_at.date() for log in completed), reverse=True)

    current_streak = 0
    best_streak = 0
    temp_streak = 1

    today = datetime.utcnow().date()

    # Current streak (from today backwards)
    if dates and (today - dates[0]).days <= 1:
        current_streak = 1
        for i in range(1, len(dates)):
            if (dates[i - 1] - dates[i]).days <= 2:  # Allow 1 day gap
                current_streak += 1
            else:
                break

    # Best streak
    for i in range(1, len(dates)):
        if (dates[i - 1] - dates[i]).days <= 2:
            temp_streak += 1
        else:
            best_streak = max(best_streak, temp_streak)
            temp_streak = 1
    best_streak = max(best_streak, temp_streak)

    return {"current": current_streak, "best": best_streak}

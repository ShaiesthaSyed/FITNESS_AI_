"""Recovery and care recommendation engine."""
from datetime import datetime, timedelta


def generate_recovery_plan(
    consecutive_workout_days: int = 0,
    fatigue_level: int = 5,
    sleep_hours: float = 7.0,
    water_intake: float = 2.0,
    last_workout_date: str = None,
    soreness_level: int = 3,
) -> dict:
    """Generate personalized recovery recommendations."""

    recovery_score = _calculate_recovery_score(
        fatigue_level, sleep_hours, water_intake, soreness_level, consecutive_workout_days
    )

    return {
        "recovery_score": recovery_score,
        "recovery_status": _get_recovery_status(recovery_score),
        "hydration": _get_hydration_recommendation(water_intake),
        "sleep": _get_sleep_recommendation(sleep_hours),
        "rest_day": _should_rest(consecutive_workout_days, fatigue_level, soreness_level),
        "soreness": _get_soreness_guidance(soreness_level),
        "fatigue_meter": {
            "level": fatigue_level,
            "label": _fatigue_label(fatigue_level),
            "color": _fatigue_color(fatigue_level),
        },
        "tips": _get_recovery_tips(recovery_score, fatigue_level),
    }


def _calculate_recovery_score(fatigue: int, sleep: float, water: float, soreness: int, consecutive: int) -> int:
    """Calculate a 0-100 recovery score."""
    score = 100

    # Fatigue penalty (0-30 points)
    score -= max(0, (fatigue - 3) * 6)

    # Sleep bonus/penalty
    if sleep >= 7:
        score += min(10, (sleep - 7) * 5)
    else:
        score -= (7 - sleep) * 8

    # Hydration bonus/penalty
    if water >= 2.5:
        score += 5
    elif water < 1.5:
        score -= 15

    # Soreness penalty
    score -= max(0, (soreness - 3) * 5)

    # Consecutive workout penalty
    if consecutive >= 5:
        score -= 15
    elif consecutive >= 3:
        score -= 5

    return max(0, min(100, round(score)))


def _get_recovery_status(score: int) -> dict:
    """Return recovery status based on score."""
    if score >= 80:
        return {"label": "Fully Recovered", "color": "#22c55e", "emoji": "💪"}
    elif score >= 60:
        return {"label": "Mostly Recovered", "color": "#84cc16", "emoji": "👍"}
    elif score >= 40:
        return {"label": "Moderate Recovery", "color": "#eab308", "emoji": "⚠️"}
    elif score >= 20:
        return {"label": "Low Recovery", "color": "#f97316", "emoji": "🔶"}
    else:
        return {"label": "Rest Needed", "color": "#ef4444", "emoji": "🛑"}


def _get_hydration_recommendation(water_intake: float) -> dict:
    """Generate hydration recommendation."""
    target = 3.0

    if water_intake >= target:
        status = "Great"
        message = "You're well hydrated! Keep it up."
        color = "#22c55e"
    elif water_intake >= 2.0:
        status = "Good"
        message = f"Try to drink {target - water_intake:.1f}L more today."
        color = "#84cc16"
    elif water_intake >= 1.0:
        status = "Low"
        message = "You need to drink more water. Aim for at least 2.5-3L daily."
        color = "#eab308"
    else:
        status = "Critical"
        message = "Your hydration is very low. Drink water immediately!"
        color = "#ef4444"

    return {
        "current": water_intake,
        "target": target,
        "percentage": round(min(water_intake / target * 100, 100)),
        "status": status,
        "message": message,
        "color": color,
    }


def _get_sleep_recommendation(sleep_hours: float) -> dict:
    """Generate sleep recommendation."""
    target = 7.5

    if sleep_hours >= 8:
        quality = "Excellent"
        message = "Great sleep! You're well-rested for today."
        color = "#22c55e"
    elif sleep_hours >= 7:
        quality = "Good"
        message = "Decent sleep. Try to get 7.5-8 hours for optimal recovery."
        color = "#84cc16"
    elif sleep_hours >= 6:
        quality = "Fair"
        message = "Below optimal. Prioritize sleep tonight for better recovery."
        color = "#eab308"
    else:
        quality = "Poor"
        message = "Sleep deprivation affects muscle recovery and performance. Rest early tonight."
        color = "#ef4444"

    return {
        "hours": sleep_hours,
        "target": target,
        "quality": quality,
        "message": message,
        "color": color,
    }


def _should_rest(consecutive_days: int, fatigue: int, soreness: int) -> dict:
    """Determine if the user should take a rest day."""
    should_rest = False
    reason = ""

    if consecutive_days >= 5:
        should_rest = True
        reason = "You've worked out 5+ days in a row. A rest day is essential for muscle repair."
    elif fatigue >= 8:
        should_rest = True
        reason = "Your fatigue level is very high. Rest today to avoid overtraining."
    elif soreness >= 8:
        should_rest = True
        reason = "High soreness indicates your muscles need time to recover."
    elif consecutive_days >= 3 and fatigue >= 6:
        should_rest = True
        reason = "Multiple consecutive workout days with moderate fatigue — consider resting."

    return {
        "recommended": should_rest,
        "consecutive_workout_days": consecutive_days,
        "reason": reason if should_rest else "You're good to workout today! 💪",
    }


def _get_soreness_guidance(level: int) -> dict:
    """Get guidance based on soreness level."""
    if level <= 3:
        return {"status": "Minimal", "advice": "Normal post-workout soreness. Safe to train.", "color": "#22c55e"}
    elif level <= 5:
        return {"status": "Moderate", "advice": "Light stretching and foam rolling recommended before your next workout.", "color": "#eab308"}
    elif level <= 7:
        return {"status": "High", "advice": "Focus on active recovery — walking, stretching, light yoga.", "color": "#f97316"}
    else:
        return {"status": "Severe", "advice": "Take a full rest day. Apply ice if needed. Consult a doctor if persistent.", "color": "#ef4444"}


def _fatigue_label(level: int) -> str:
    if level <= 2: return "Fresh"
    elif level <= 4: return "Mild"
    elif level <= 6: return "Moderate"
    elif level <= 8: return "High"
    else: return "Exhausted"


def _fatigue_color(level: int) -> str:
    if level <= 2: return "#22c55e"
    elif level <= 4: return "#84cc16"
    elif level <= 6: return "#eab308"
    elif level <= 8: return "#f97316"
    else: return "#ef4444"


def _get_recovery_tips(score: int, fatigue: int) -> list:
    """Return contextual recovery tips."""
    tips = []
    if score < 60:
        tips.append("Consider taking a rest day or doing light yoga")
        tips.append("Focus on sleep quality — avoid screens 1 hour before bed")
    if fatigue >= 6:
        tips.append("Reduce workout intensity by 20% tomorrow")
        tips.append("Include a 10-minute stretching session post-workout")
    tips.extend([
        "Stay hydrated throughout the day — carry a water bottle",
        "Eat protein within 30 minutes of completing your workout",
        "Foam rolling for 5-10 minutes can significantly reduce soreness",
    ])
    return tips[:5]

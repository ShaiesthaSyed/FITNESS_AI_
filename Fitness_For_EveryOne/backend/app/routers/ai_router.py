"""AI Coach router — Gemini-powered fitness chat with user context injection."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, AIChatHistory, ProgressLog
from app.schemas import AIChatRequest, AIChatResponse
from app.auth import get_current_user
from app.engines.fitness_engine import get_full_fitness_profile
from app.config import settings

router = APIRouter(prefix="/ai", tags=["AI Coach"])


def _build_system_prompt(user: User, fitness: dict, recent_progress: list) -> str:
    """Build a structured system prompt with user context."""
    progress_summary = ""
    if recent_progress:
        latest = recent_progress[0]
        progress_summary = f"""
Recent Progress:
- Latest weight: {latest.weight_kg or 'Not logged'} kg
- Latest fatigue: {latest.fatigue_level or 'Not logged'}/10
- Notes: {latest.notes or 'None'}
"""

    return f"""You are FitCoach AI, a friendly, knowledgeable, and motivating personal fitness coach.
You provide personalized advice based on the user's profile and goals.

User Profile:
- Name: {user.full_name}
- Age: {user.age or 'Unknown'}
- Gender: {user.gender or 'Unknown'}
- Height: {user.height_cm or 'Unknown'} cm
- Weight: {user.weight_kg or 'Unknown'} kg
- Activity Level: {user.activity_level or 'moderate'}
- Goal: {user.goal or 'maintain'} (fat_loss / muscle_gain / maintain)
- Diet Type: {user.diet_type or 'vegetarian'}
- Workout Days/Week: {user.workout_days_per_week or 4}
- Medical Conditions: {user.medical_conditions or 'None reported'}

Fitness Metrics:
- BMI: {fitness['bmi']}
- BMR: {fitness['bmr']} kcal/day
- TDEE: {fitness['tdee']} kcal/day
- Calorie Target: {fitness['calorie_target']} kcal/day
- Protein Target: {fitness['protein_target']} g/day
- Fitness Level: {fitness['fitness_level']}
{progress_summary}
Rules:
1. Always address the user by their first name
2. Give specific, actionable advice based on their profile
3. Be encouraging and positive
4. Keep responses concise (2-4 paragraphs max)
5. If asked about medical conditions, recommend consulting a doctor
6. Suggest Indian-friendly food options when relevant
7. Reference their specific goals and metrics in your advice
8. CRITICAL: Strictly adhere to any dietary or exercise restrictions necessitated by the user's medical conditions. For example, explicitly avoid recommending spicy/acidic foods if they have gastric problems.
"""


@router.post("/chat", response_model=AIChatResponse)
def chat_with_coach(
    req: AIChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Chat with AI fitness coach powered by Gemini."""

    # Get fitness profile
    fitness = get_full_fitness_profile(current_user)

    # Get recent progress
    recent_progress = (
        db.query(ProgressLog)
        .filter(ProgressLog.user_id == current_user.id)
        .order_by(ProgressLog.logged_at.desc())
        .limit(5)
        .all()
    )

    # Build context-rich prompt
    system_prompt = _build_system_prompt(current_user, fitness, recent_progress)

    # Get recent chat history for conversation context
    recent_chats = (
        db.query(AIChatHistory)
        .filter(AIChatHistory.user_id == current_user.id)
        .order_by(AIChatHistory.created_at.desc())
        .limit(10)
        .all()
    )
    recent_chats.reverse()

    # Try to use Gemini API
    reply = ""
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai

            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")

            # Build conversation history
            history_text = ""
            for chat in recent_chats[-6:]:
                role = "User" if chat.role == "user" else "Coach"
                history_text += f"{role}: {chat.message}\n"

            full_prompt = f"""{system_prompt}

Conversation History:
{history_text}

User: {req.message}

Coach:"""

            response = model.generate_content(full_prompt)
            reply = response.text

        except Exception as e:
            reply = _fallback_response(req.message, current_user, fitness)
    else:
        reply = _fallback_response(req.message, current_user, fitness)

    # Save chat history
    db.add(AIChatHistory(user_id=current_user.id, role="user", message=req.message))
    db.add(AIChatHistory(user_id=current_user.id, role="assistant", message=reply))
    db.commit()

    return AIChatResponse(reply=reply)


@router.get("/chat/history")
def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get recent chat history."""
    chats = (
        db.query(AIChatHistory)
        .filter(AIChatHistory.user_id == current_user.id)
        .order_by(AIChatHistory.created_at.desc())
        .limit(50)
        .all()
    )
    chats.reverse()
    return [
        {
            "id": chat.id,
            "role": chat.role,
            "message": chat.message,
            "created_at": chat.created_at.isoformat(),
        }
        for chat in chats
    ]


def _fallback_response(message: str, user: User, fitness: dict) -> str:
    """Rule-based fallback when Gemini is unavailable."""
    name = user.full_name.split()[0] if user.full_name else "there"
    msg_lower = message.lower()

    if any(w in msg_lower for w in ["workout", "exercise", "train"]):
        return (
            f"Hey {name}! Based on your {user.goal} goal's, I recommend sticking to your "
            f"{user.workout_days_per_week}-day split. As a {fitness['fitness_level']} level athlete, "
            f"focus on progressive overload — gradually increase reps or sets each week. "
            f"Don't forget to warm up for 5-10 minutes before each session! 💪"
        )
    elif any(w in msg_lower for w in ["diet", "food", "eat", "calorie", "nutrition", "meal"]):
        return (
            f"Great question, {name}! Your daily calorie target is {fitness['calorie_target']} kcal "
            f"with {fitness['protein_target']}g of protein. Since you follow a {user.diet_type} diet, "
            f"try including paneer, dal, and soy for protein. Spread your meals across 4-5 servings "
            f"throughout the day for steady energy! 🥗"
        )
    elif any(w in msg_lower for w in ["weight", "fat", "slim", "lean"]):
        return (
            f"{name}, your current BMI is {fitness['bmi']}. For your {user.goal} goal, "
            f"consistency is key. Track your weight weekly at the same time. A healthy rate of change "
            f"is 0.5-1 kg per week. Stay patient and trust the process! 📊"
        )
    elif any(w in msg_lower for w in ["rest", "recover", "sleep", "tired", "sore"]):
        return (
            f"Recovery is just as important as training, {name}! Aim for 7-8 hours of quality sleep. "
            f"Drink at least 3 liters of water daily. If you're feeling sore, try light stretching "
            f"or foam rolling. Take a rest day when your body asks for it — that's when muscles grow! 😴"
        )
    else:
        return (
            f"Hey {name}! I'm your AI fitness coach. I can help you with workouts, nutrition, "
            f"recovery tips, and weight management. Your current goal is '{user.goal}' and you're at "
            f"a {fitness['fitness_level']} fitness level. Ask me anything about your fitness journey! 🏋️"
        )

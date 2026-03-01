"""Rule-based personalized workout plan generator."""

# ─── Exercise Database ──────────────────────────────────────
EXERCISES = {
    "chest": [
        {"name": "Push-Ups", "beginner": {"sets": 3, "reps": "10-12"}, "intermediate": {"sets": 4, "reps": "15-20"}},
        {"name": "Incline Push-Ups", "beginner": {"sets": 3, "reps": "10"}, "intermediate": {"sets": 4, "reps": "15"}},
        {"name": "Chest Dips", "beginner": {"sets": 2, "reps": "6-8"}, "intermediate": {"sets": 3, "reps": "10-12"}},
        {"name": "Diamond Push-Ups", "beginner": {"sets": 2, "reps": "8"}, "intermediate": {"sets": 3, "reps": "12-15"}},
        {"name": "Wide Push-Ups", "beginner": {"sets": 3, "reps": "10"}, "intermediate": {"sets": 4, "reps": "15"}},
    ],
    "back": [
        {"name": "Pull-Ups", "beginner": {"sets": 3, "reps": "5-8"}, "intermediate": {"sets": 4, "reps": "8-12"}},
        {"name": "Inverted Rows", "beginner": {"sets": 3, "reps": "8-10"}, "intermediate": {"sets": 4, "reps": "12-15"}},
        {"name": "Superman Hold", "beginner": {"sets": 3, "reps": "15s"}, "intermediate": {"sets": 4, "reps": "30s"}},
        {"name": "Resistance Band Rows", "beginner": {"sets": 3, "reps": "10"}, "intermediate": {"sets": 4, "reps": "15"}},
    ],
    "legs": [
        {"name": "Bodyweight Squats", "beginner": {"sets": 3, "reps": "12-15"}, "intermediate": {"sets": 4, "reps": "20"}},
        {"name": "Lunges", "beginner": {"sets": 3, "reps": "10/leg"}, "intermediate": {"sets": 4, "reps": "15/leg"}},
        {"name": "Glute Bridges", "beginner": {"sets": 3, "reps": "12"}, "intermediate": {"sets": 4, "reps": "20"}},
        {"name": "Wall Sit", "beginner": {"sets": 3, "reps": "20s"}, "intermediate": {"sets": 3, "reps": "45s"}},
        {"name": "Calf Raises", "beginner": {"sets": 3, "reps": "15"}, "intermediate": {"sets": 4, "reps": "25"}},
        {"name": "Jump Squats", "beginner": {"sets": 2, "reps": "8"}, "intermediate": {"sets": 3, "reps": "15"}},
    ],
    "shoulders": [
        {"name": "Pike Push-Ups", "beginner": {"sets": 3, "reps": "8"}, "intermediate": {"sets": 4, "reps": "12"}},
        {"name": "Lateral Raises (Band)", "beginner": {"sets": 3, "reps": "12"}, "intermediate": {"sets": 4, "reps": "15"}},
        {"name": "Front Raises", "beginner": {"sets": 3, "reps": "10"}, "intermediate": {"sets": 4, "reps": "15"}},
        {"name": "Shoulder Taps", "beginner": {"sets": 3, "reps": "10/side"}, "intermediate": {"sets": 4, "reps": "15/side"}},
    ],
    "arms": [
        {"name": "Bicep Curls (Band)", "beginner": {"sets": 3, "reps": "12"}, "intermediate": {"sets": 4, "reps": "15"}},
        {"name": "Tricep Dips", "beginner": {"sets": 3, "reps": "8-10"}, "intermediate": {"sets": 4, "reps": "12-15"}},
        {"name": "Hammer Curls", "beginner": {"sets": 3, "reps": "10"}, "intermediate": {"sets": 4, "reps": "15"}},
        {"name": "Close-Grip Push-Ups", "beginner": {"sets": 3, "reps": "8"}, "intermediate": {"sets": 3, "reps": "15"}},
    ],
    "core": [
        {"name": "Plank", "beginner": {"sets": 3, "reps": "20s"}, "intermediate": {"sets": 3, "reps": "60s"}},
        {"name": "Crunches", "beginner": {"sets": 3, "reps": "15"}, "intermediate": {"sets": 4, "reps": "25"}},
        {"name": "Leg Raises", "beginner": {"sets": 3, "reps": "10"}, "intermediate": {"sets": 4, "reps": "15"}},
        {"name": "Mountain Climbers", "beginner": {"sets": 3, "reps": "20"}, "intermediate": {"sets": 4, "reps": "30"}},
        {"name": "Russian Twists", "beginner": {"sets": 3, "reps": "15/side"}, "intermediate": {"sets": 4, "reps": "20/side"}},
        {"name": "Bicycle Crunches", "beginner": {"sets": 3, "reps": "15"}, "intermediate": {"sets": 4, "reps": "25"}},
    ],
    "cardio": [
        {"name": "Jumping Jacks", "beginner": {"sets": 3, "reps": "30s"}, "intermediate": {"sets": 4, "reps": "60s"}},
        {"name": "High Knees", "beginner": {"sets": 3, "reps": "20s"}, "intermediate": {"sets": 3, "reps": "45s"}},
        {"name": "Burpees", "beginner": {"sets": 2, "reps": "5"}, "intermediate": {"sets": 3, "reps": "12"}},
        {"name": "Skipping", "beginner": {"sets": 3, "reps": "30s"}, "intermediate": {"sets": 3, "reps": "60s"}},
    ],
}

# ─── Weekly Split Templates ────────────────────
SPLITS = {
    3: {
        "fat_loss": [
            {"day": "Day 1", "label": "Full Body + Cardio", "muscle_groups": ["chest", "back", "legs", "cardio"]},
            {"day": "Day 2", "label": "Upper Body + Core", "muscle_groups": ["shoulders", "arms", "core"]},
            {"day": "Day 3", "label": "Lower Body + Cardio", "muscle_groups": ["legs", "core", "cardio"]},
        ],
        "muscle_gain": [
            {"day": "Day 1", "label": "Push (Chest + Shoulders + Triceps)", "muscle_groups": ["chest", "shoulders", "arms"]},
            {"day": "Day 2", "label": "Pull (Back + Biceps)", "muscle_groups": ["back", "arms", "core"]},
            {"day": "Day 3", "label": "Legs + Core", "muscle_groups": ["legs", "core"]},
        ],
        "maintain": [
            {"day": "Day 1", "label": "Upper Body", "muscle_groups": ["chest", "back", "shoulders"]},
            {"day": "Day 2", "label": "Lower Body", "muscle_groups": ["legs", "core"]},
            {"day": "Day 3", "label": "Full Body", "muscle_groups": ["arms", "cardio", "core"]},
        ],
    },
    4: {
        "fat_loss": [
            {"day": "Day 1", "label": "Upper Body + Cardio", "muscle_groups": ["chest", "shoulders", "cardio"]},
            {"day": "Day 2", "label": "Lower Body", "muscle_groups": ["legs", "core"]},
            {"day": "Day 3", "label": "Back + Arms + Cardio", "muscle_groups": ["back", "arms", "cardio"]},
            {"day": "Day 4", "label": "Full Body HIIT", "muscle_groups": ["legs", "core", "cardio"]},
        ],
        "muscle_gain": [
            {"day": "Day 1", "label": "Chest + Triceps", "muscle_groups": ["chest", "arms"]},
            {"day": "Day 2", "label": "Back + Biceps", "muscle_groups": ["back", "arms"]},
            {"day": "Day 3", "label": "Shoulders + Core", "muscle_groups": ["shoulders", "core"]},
            {"day": "Day 4", "label": "Legs", "muscle_groups": ["legs", "core"]},
        ],
        "maintain": [
            {"day": "Day 1", "label": "Upper Push", "muscle_groups": ["chest", "shoulders"]},
            {"day": "Day 2", "label": "Lower Body", "muscle_groups": ["legs", "core"]},
            {"day": "Day 3", "label": "Upper Pull", "muscle_groups": ["back", "arms"]},
            {"day": "Day 4", "label": "Full Body + Cardio", "muscle_groups": ["core", "cardio"]},
        ],
    },
    5: {
        "fat_loss": [
            {"day": "Day 1", "label": "Chest + Cardio", "muscle_groups": ["chest", "cardio"]},
            {"day": "Day 2", "label": "Back + Core", "muscle_groups": ["back", "core"]},
            {"day": "Day 3", "label": "Legs", "muscle_groups": ["legs"]},
            {"day": "Day 4", "label": "Shoulders + Arms", "muscle_groups": ["shoulders", "arms"]},
            {"day": "Day 5", "label": "HIIT + Core", "muscle_groups": ["cardio", "core"]},
        ],
        "muscle_gain": [
            {"day": "Day 1", "label": "Chest", "muscle_groups": ["chest", "core"]},
            {"day": "Day 2", "label": "Back", "muscle_groups": ["back"]},
            {"day": "Day 3", "label": "Shoulders + Arms", "muscle_groups": ["shoulders", "arms"]},
            {"day": "Day 4", "label": "Legs", "muscle_groups": ["legs"]},
            {"day": "Day 5", "label": "Full Body", "muscle_groups": ["chest", "back", "core"]},
        ],
        "maintain": [
            {"day": "Day 1", "label": "Push", "muscle_groups": ["chest", "shoulders"]},
            {"day": "Day 2", "label": "Pull", "muscle_groups": ["back", "arms"]},
            {"day": "Day 3", "label": "Legs", "muscle_groups": ["legs"]},
            {"day": "Day 4", "label": "Upper Body", "muscle_groups": ["chest", "back", "shoulders"]},
            {"day": "Day 5", "label": "Core + Cardio", "muscle_groups": ["core", "cardio"]},
        ],
    },
    6: {
        "fat_loss": [
            {"day": "Day 1", "label": "Chest + Cardio", "muscle_groups": ["chest", "cardio"]},
            {"day": "Day 2", "label": "Back + Core", "muscle_groups": ["back", "core"]},
            {"day": "Day 3", "label": "Legs", "muscle_groups": ["legs"]},
            {"day": "Day 4", "label": "Shoulders + Arms", "muscle_groups": ["shoulders", "arms"]},
            {"day": "Day 5", "label": "Full Body HIIT", "muscle_groups": ["cardio", "core", "legs"]},
            {"day": "Day 6", "label": "Active Recovery", "muscle_groups": ["core"]},
        ],
        "muscle_gain": [
            {"day": "Day 1", "label": "Chest + Triceps", "muscle_groups": ["chest", "arms"]},
            {"day": "Day 2", "label": "Back + Biceps", "muscle_groups": ["back", "arms"]},
            {"day": "Day 3", "label": "Legs", "muscle_groups": ["legs"]},
            {"day": "Day 4", "label": "Shoulders", "muscle_groups": ["shoulders", "core"]},
            {"day": "Day 5", "label": "Arms + Core", "muscle_groups": ["arms", "core"]},
            {"day": "Day 6", "label": "Full Body", "muscle_groups": ["chest", "back", "legs"]},
        ],
        "maintain": [
            {"day": "Day 1", "label": "Push", "muscle_groups": ["chest", "shoulders"]},
            {"day": "Day 2", "label": "Pull", "muscle_groups": ["back", "arms"]},
            {"day": "Day 3", "label": "Legs", "muscle_groups": ["legs"]},
            {"day": "Day 4", "label": "Push", "muscle_groups": ["chest", "shoulders"]},
            {"day": "Day 5", "label": "Pull", "muscle_groups": ["back", "arms"]},
            {"day": "Day 6", "label": "Legs + Core", "muscle_groups": ["legs", "core"]},
        ],
    },
}


def generate_workout_plan(goal: str, fitness_level: str, workout_days: int) -> dict:
    """Generate a complete weekly workout plan."""
    # Clamp days to available templates
    days_key = min(max(workout_days, 3), 6)
    goal_key = goal if goal in ("fat_loss", "muscle_gain", "maintain") else "maintain"
    level = fitness_level if fitness_level in ("beginner", "intermediate") else "beginner"

    split = SPLITS.get(days_key, SPLITS[4]).get(goal_key, SPLITS[4]["maintain"])

    plan = {
        "goal": goal_key,
        "fitness_level": level,
        "days_per_week": days_key,
        "difficulty": "Beginner" if level == "beginner" else "Intermediate",
        "rest_between_sets": "60s" if goal_key == "fat_loss" else "90s",
        "weekly_plan": [],
    }

    for day_info in split:
        exercises = []
        for group in day_info["muscle_groups"]:
            group_exercises = EXERCISES.get(group, [])
            # Pick 2-3 exercises per muscle group
            for ex in group_exercises[:3]:
                level_data = ex.get(level, ex.get("beginner"))
                exercises.append({
                    "name": ex["name"],
                    "muscle_group": group,
                    "sets": level_data["sets"],
                    "reps": level_data["reps"],
                    "rest": plan["rest_between_sets"],
                })

        plan["weekly_plan"].append({
            "day": day_info["day"],
            "label": day_info["label"],
            "exercises": exercises,
            "total_exercises": len(exercises),
            "estimated_duration": f"{len(exercises) * 4 + 5} min",
        })

    return plan

"""Rule-based personalized diet plan generator with Indian meal options."""

MEAL_DATABASE = {
    "vegetarian": {
        "breakfast": [
            {"name": "Oats with Banana & Almonds", "calories": 350, "protein": 12, "carbs": 55, "fats": 10, "icon": "🥣"},
            {"name": "Poha with Peanuts", "calories": 300, "protein": 8, "carbs": 45, "fats": 10, "icon": "🍚"},
            {"name": "Moong Dal Chilla", "calories": 280, "protein": 15, "carbs": 35, "fats": 8, "icon": "🥞"},
            {"name": "Idli with Sambar", "calories": 320, "protein": 10, "carbs": 50, "fats": 6, "icon": "🍽️"},
            {"name": "Ragi Porridge with Nuts", "calories": 300, "protein": 10, "carbs": 48, "fats": 9, "icon": "🥣"},
        ],
        "lunch": [
            {"name": "Dal + Brown Rice + Sabzi", "calories": 500, "protein": 18, "carbs": 70, "fats": 14, "icon": "🍛"},
            {"name": "Rajma Chawal", "calories": 520, "protein": 20, "carbs": 75, "fats": 12, "icon": "🍲"},
            {"name": "Chole with Roti", "calories": 480, "protein": 18, "carbs": 60, "fats": 16, "icon": "🫓"},
            {"name": "Paneer Bhurji + Roti", "calories": 500, "protein": 24, "carbs": 45, "fats": 22, "icon": "🧀"},
            {"name": "Vegetable Biryani", "calories": 450, "protein": 12, "carbs": 65, "fats": 14, "icon": "🍚"},
        ],
        "snack": [
            {"name": "Fruit Bowl with Seeds", "calories": 180, "protein": 4, "carbs": 35, "fats": 5, "icon": "🍎"},
            {"name": "Mixed Nuts (30g)", "calories": 200, "protein": 6, "carbs": 8, "fats": 18, "icon": "🥜"},
            {"name": "Greek Yogurt with Honey", "calories": 150, "protein": 12, "carbs": 18, "fats": 4, "icon": "🍯"},
            {"name": "Sprouts Chaat", "calories": 160, "protein": 10, "carbs": 22, "fats": 4, "icon": "🥗"},
            {"name": "Protein Smoothie", "calories": 220, "protein": 15, "carbs": 30, "fats": 5, "icon": "🥤"},
        ],
        "dinner": [
            {"name": "Palak Paneer + Roti", "calories": 450, "protein": 22, "carbs": 40, "fats": 20, "icon": "🥬"},
            {"name": "Mixed Dal + Rice", "calories": 420, "protein": 16, "carbs": 60, "fats": 12, "icon": "🍛"},
            {"name": "Tofu Stir-Fry + Quinoa", "calories": 400, "protein": 20, "carbs": 45, "fats": 14, "icon": "🥘"},
            {"name": "Vegetable Soup + Multigrain Bread", "calories": 320, "protein": 10, "carbs": 45, "fats": 8, "icon": "🍜"},
            {"name": "Mushroom Curry + Brown Rice", "calories": 380, "protein": 14, "carbs": 50, "fats": 12, "icon": "🍄"},
        ],
    },
    "eggetarian": {
        "breakfast": [
            {"name": "Egg Omelette + Toast", "calories": 380, "protein": 22, "carbs": 30, "fats": 18, "icon": "🍳"},
            {"name": "Boiled Eggs + Avocado Toast", "calories": 400, "protein": 20, "carbs": 28, "fats": 24, "icon": "🥑"},
            {"name": "Egg Bhurji + Paratha", "calories": 420, "protein": 18, "carbs": 40, "fats": 20, "icon": "🥚"},
            {"name": "French Toast with Honey", "calories": 350, "protein": 14, "carbs": 45, "fats": 12, "icon": "🍞"},
        ],
        "lunch": [
            {"name": "Egg Curry + Rice", "calories": 520, "protein": 24, "carbs": 60, "fats": 18, "icon": "🍛"},
            {"name": "Egg Fried Rice", "calories": 480, "protein": 20, "carbs": 55, "fats": 18, "icon": "🍚"},
            {"name": "Dal + Roti + Egg Side", "calories": 500, "protein": 26, "carbs": 50, "fats": 18, "icon": "🫓"},
        ],
        "snack": [
            {"name": "Boiled Egg + Fruit", "calories": 180, "protein": 12, "carbs": 20, "fats": 6, "icon": "🥚"},
            {"name": "Protein Smoothie", "calories": 220, "protein": 18, "carbs": 28, "fats": 5, "icon": "🥤"},
            {"name": "Mixed Nuts", "calories": 200, "protein": 6, "carbs": 8, "fats": 18, "icon": "🥜"},
        ],
        "dinner": [
            {"name": "Egg + Vegetable Stir-Fry", "calories": 380, "protein": 22, "carbs": 30, "fats": 16, "icon": "🥘"},
            {"name": "Omelette + Multigrain Roti", "calories": 400, "protein": 20, "carbs": 38, "fats": 18, "icon": "🍳"},
            {"name": "Spinach Egg Curry + Rice", "calories": 450, "protein": 24, "carbs": 48, "fats": 16, "icon": "🥬"},
        ],
    },
    "non_vegetarian": {
        "breakfast": [
            {"name": "Egg Omelette + Toast", "calories": 380, "protein": 22, "carbs": 30, "fats": 18, "icon": "🍳"},
            {"name": "Chicken Sandwich", "calories": 420, "protein": 28, "carbs": 35, "fats": 16, "icon": "🥪"},
        ],
        "lunch": [
            {"name": "Grilled Chicken + Rice + Salad", "calories": 550, "protein": 40, "carbs": 55, "fats": 14, "icon": "🍗"},
            {"name": "Fish Curry + Rice", "calories": 500, "protein": 35, "carbs": 50, "fats": 16, "icon": "🐟"},
            {"name": "Chicken Biryani", "calories": 580, "protein": 32, "carbs": 65, "fats": 18, "icon": "🍚"},
        ],
        "snack": [
            {"name": "Protein Shake", "calories": 200, "protein": 25, "carbs": 15, "fats": 4, "icon": "🥤"},
            {"name": "Mixed Nuts", "calories": 200, "protein": 6, "carbs": 8, "fats": 18, "icon": "🥜"},
        ],
        "dinner": [
            {"name": "Grilled Fish + Vegetables", "calories": 400, "protein": 35, "carbs": 20, "fats": 18, "icon": "🐟"},
            {"name": "Chicken Curry + Roti", "calories": 480, "protein": 32, "carbs": 40, "fats": 20, "icon": "🍛"},
            {"name": "Egg Stir-Fry + Brown Rice", "calories": 420, "protein": 24, "carbs": 45, "fats": 16, "icon": "🥘"},
        ],
    },
    "vegan": {
        "breakfast": [
            {"name": "Overnight Oats (Plant Milk)", "calories": 320, "protein": 10, "carbs": 50, "fats": 10, "icon": "🥣"},
            {"name": "Tofu Scramble + Toast", "calories": 350, "protein": 18, "carbs": 32, "fats": 16, "icon": "🍞"},
        ],
        "lunch": [
            {"name": "Chickpea Bowl + Quinoa", "calories": 500, "protein": 22, "carbs": 65, "fats": 14, "icon": "🥗"},
            {"name": "Rajma + Brown Rice", "calories": 480, "protein": 18, "carbs": 70, "fats": 10, "icon": "🍛"},
        ],
        "snack": [
            {"name": "Trail Mix", "calories": 220, "protein": 8, "carbs": 18, "fats": 16, "icon": "🥜"},
            {"name": "Fruit + Peanut Butter", "calories": 250, "protein": 8, "carbs": 30, "fats": 14, "icon": "🍎"},
        ],
        "dinner": [
            {"name": "Tofu Curry + Roti", "calories": 420, "protein": 20, "carbs": 45, "fats": 18, "icon": "🥘"},
            {"name": "Lentil Soup + Bread", "calories": 380, "protein": 16, "carbs": 50, "fats": 10, "icon": "🍜"},
        ],
    },
}


def _select_meals(diet_type: str, calorie_target: float) -> list:
    """Select meals from the database to approximate the calorie target."""
    meals_db = MEAL_DATABASE.get(diet_type, MEAL_DATABASE["vegetarian"])
    import random

    selected = []
    for meal_type in ["breakfast", "lunch", "snack", "dinner"]:
        options = meals_db.get(meal_type, [])
        if options:
            meal = random.choice(options)
            selected.append({**meal, "meal_type": meal_type.capitalize()})

    return selected


def generate_diet_plan(calorie_target: float, protein_target: float, diet_type: str, goal: str) -> dict:
    """Generate a personalized daily diet plan."""
    meals = _select_meals(diet_type, calorie_target)

    total_cals = sum(m["calories"] for m in meals)
    total_protein = sum(m["protein"] for m in meals)
    total_carbs = sum(m["carbs"] for m in meals)
    total_fats = sum(m["fats"] for m in meals)

    return {
        "calorie_target": calorie_target,
        "protein_target": protein_target,
        "diet_type": diet_type,
        "goal": goal,
        "meals": meals,
        "daily_targets": {
            "calories": total_cals,
            "protein": total_protein,
            "carbs": total_carbs,
            "fats": total_fats,
        },
        "tips": _get_diet_tips(goal, diet_type),
    }


def _get_diet_tips(goal: str, diet_type: str) -> list:
    """Return diet tips based on goal."""
    tips = {
        "fat_loss": [
            "Eat slowly and mindfully — it takes 20 minutes for your brain to register fullness",
            "Prioritize protein to preserve muscle during a calorie deficit",
            "Drink water before meals to reduce appetite naturally",
            "Avoid sugary drinks and processed snacks",
        ],
        "muscle_gain": [
            "Eat a protein-rich meal within 1 hour after your workout",
            "Include a healthy fat source with each meal for hormone health",
            "Don't skip carbs — they fuel intense training sessions",
            "Aim for 4-5 meals spread throughout the day",
        ],
        "maintain": [
            "Keep your meals balanced with all three macronutrients",
            "Stay consistent with meal timing for steady energy",
            "Listen to your hunger cues and eat accordingly",
            "Include colorful vegetables for micronutrients",
        ],
    }
    return tips.get(goal, tips["maintain"])

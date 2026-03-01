"""Core fitness calculations: BMI, BMR, TDEE, calorie/macro targets."""


def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    """Calculate Body Mass Index."""
    if not weight_kg or not height_cm or height_cm == 0:
        return 0.0
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 1)


def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
    """Calculate Basal Metabolic Rate using Mifflin-St Jeor equation."""
    if not all([weight_kg, height_cm, age]):
        return 0.0
    if gender == "male":
        return round(10 * weight_kg + 6.25 * height_cm - 5 * age + 5, 0)
    else:
        return round(10 * weight_kg + 6.25 * height_cm - 5 * age - 161, 0)


def calculate_tdee(bmr: float, activity_level: str) -> float:
    """Calculate Total Daily Energy Expenditure."""
    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9,
    }
    factor = multipliers.get(activity_level, 1.55)
    return round(bmr * factor, 0)


def calculate_calorie_target(tdee: float, goal: str) -> float:
    """Adjust TDEE based on user goal."""
    adjustments = {
        "fat_loss": -500,
        "muscle_gain": 300,
        "maintain": 0,
    }
    adjustment = adjustments.get(goal, 0)
    return round(tdee + adjustment, 0)


def calculate_protein_target(weight_kg: float, goal: str) -> float:
    """Calculate daily protein target in grams."""
    multipliers = {
        "fat_loss": 2.0,
        "muscle_gain": 2.2,
        "maintain": 1.6,
    }
    factor = multipliers.get(goal, 1.6)
    return round(weight_kg * factor, 0)


def calculate_macros(calorie_target: float, protein_target: float) -> dict:
    """Calculate macro split (protein, carbs, fats) in grams."""
    protein_cals = protein_target * 4
    fat_cals = calorie_target * 0.25
    fat_g = round(fat_cals / 9, 0)
    carb_cals = calorie_target - protein_cals - fat_cals
    carb_g = round(max(carb_cals, 0) / 4, 0)
    return {
        "protein_g": protein_target,
        "carbs_g": carb_g,
        "fats_g": fat_g,
        "protein_cals": round(protein_cals, 0),
        "carbs_cals": round(carb_cals, 0),
        "fats_cals": round(fat_cals, 0),
    }


def classify_fitness_level(bmi: float, activity_level: str) -> str:
    """Classify user fitness level based on BMI and activity."""
    if bmi == 0:
        return "unknown"
    active_levels = {"active", "very_active"}
    if bmi < 18.5:
        return "beginner"
    elif 18.5 <= bmi < 25:
        return "intermediate" if activity_level in active_levels else "beginner"
    elif 25 <= bmi < 30:
        return "beginner"
    else:
        return "beginner"


def get_full_fitness_profile(user) -> dict:
    """Compute the complete fitness profile from a user model."""
    bmi = calculate_bmi(user.weight_kg or 0, user.height_cm or 0)
    bmr = calculate_bmr(user.weight_kg or 0, user.height_cm or 0, user.age or 25, user.gender or "male")
    tdee = calculate_tdee(bmr, user.activity_level or "moderate")
    calorie_target = calculate_calorie_target(tdee, user.goal or "maintain")
    protein_target = calculate_protein_target(user.weight_kg or 70, user.goal or "maintain")
    macros = calculate_macros(calorie_target, protein_target)
    fitness_level = classify_fitness_level(bmi, user.activity_level or "moderate")

    return {
        "bmi": bmi,
        "bmr": bmr,
        "tdee": tdee,
        "calorie_target": calorie_target,
        "protein_target": protein_target,
        "macros": macros,
        "fitness_level": fitness_level,
    }

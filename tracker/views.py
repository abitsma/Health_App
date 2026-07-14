from django.shortcuts import render, redirect
from django.utils import timezone
from django.contrib import messages
from .models import FoodEntry, UserProfile
from django.contrib.auth.decorators import login_required

@login_required
def dashboard(request):
    today = timezone.now().date()
    
    entries = FoodEntry.objects.filter(
        user=request.user,
        date_added=today,
    )

    calorie_goal = 2000

    meal_types = [
        ("breakfast", "Breakfast"),
        ("lunch", "Lunch"),
        ("dinner", "Dinner"),
        ("snack", "Snack"),
    ]

    meals = []

    for meal_value, meal_label in meal_types:
        meal_entries = entries.filter(meal_type=meal_value)

        food_items = []

        for entry in meal_entries:
            food_items.append({
                "name": entry.food_name,
                "calories": entry.calories,
                "protein": entry.protein,
                "carbs": entry.carbs,
                "fat": entry.fat,
            })

        meals.append({
            "mealName": meal_label,
            "mealType": meal_value,
            "foodItems": food_items,
        })

    food_data = {
        "targetCalories": calorie_goal,
        "meals": meals,
    }

    return render(request, "tracker/index.html", {
        "food_data": food_data
    })


# Log Page View
@login_required
def log(request):
    today = timezone.now().date()

    entries = FoodEntry.objects.filter(
        date_added=today
    )

    meal_types = [
        ("breakfast", "Breakfast"),
        ("lunch", "Lunch"),
        ("dinner", "Dinner"),
        ("snack", "Snack"),
    ]

    meals = []

    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fat = 0

    for meal_value, meal_label in meal_types:

        meal_entries = entries.filter(meal_type=meal_value)

        food_items = []

        meal_calories = 0
        meal_protein = 0
        meal_carbs = 0
        meal_fat = 0

        for entry in meal_entries:

            food_items.append({
                "name": entry.food_name,
                "calories": entry.calories,
                "protein": entry.protein,
                "carbs": entry.carbs,
                "fat": entry.fat,
            })

            meal_calories += entry.calories
            meal_protein += entry.protein
            meal_carbs += entry.carbs
            meal_fat += entry.fat

        total_calories += meal_calories
        total_protein += meal_protein
        total_carbs += meal_carbs
        total_fat += meal_fat

        meals.append({
            "mealName": meal_label,
            "mealType": meal_value,
            "mealCalories": meal_calories,
            "foodItems": food_items,
        })

    context = {
        "meals": meals,
        "total_calories": total_calories,
        "calorie_goal": 2000,
        "remaining": 2000 - total_calories,
        "total_protein": total_protein,
        "total_carbs": total_carbs,
        "total_fat": total_fat,
    }

    return render(request, "tracker/log.html", context)

@login_required
def add_food(request):
    if request.method != "POST":
        messages.error(request, "Food entries must be submitted from the form.")
        return redirect("dashboard")

    food_name = request.POST.get("food_name", "").strip()
    calories_text = request.POST.get("calories", "").strip()
    meal_type = request.POST.get("meal_type", "").strip()

    valid_meal_types = ["breakfast", "lunch", "dinner", "snack"]

    if not food_name:
        messages.error(request, "Food name is required.")
        return redirect("dashboard")

    if not calories_text:
        messages.error(request, "Calories are required.")
        return redirect("dashboard")

    try:
        calories = int(calories_text)
    except ValueError:
        messages.error(request, "Calories must be a whole number.")
        return redirect("dashboard")

    if calories <= 0:
        messages.error(request, "Calories must be greater than zero.")
        return redirect("dashboard")

    if meal_type not in valid_meal_types:
        messages.error(request, "Invalid meal type.")
        return redirect("dashboard")

    FoodEntry.objects.create(
        user=request.user,
        food_name=food_name,
        calories=calories,
        meal_type=meal_type
    )

    messages.success(request, f"{food_name} was added successfully.")
    return redirect("dashboard")

@login_required
def profile(request):
    profile_obj, created = UserProfile.objects.get_or_create(
        user=request.user
    )

    if request.method == "POST":
        try:
            weight = float(request.POST.get("weight",0))
            height = float(request.POST.get("height",0))
            age = int(request.POST.get("age",0))
        except (TypeError, ValueError):
            messages.error(
                request,
                "Weight, height, and age must be valid numbers."
            )
            return redirect("profile")
        
        gender = request.POST.get("gender")
        activity_level = request.POST.get("activityLevel")
        goal = request.POST.get("goal")

        if weight <= 0 or height <= 0 or age <= 0:
            messages.error(
                request,
                "Weight, height, and age must be greater than zero."
            )
            return redirect("profile")

        profile_obj.weight = weight
        profile_obj.height = height
        profile_obj.age = age
        profile_obj.gender = gender
        profile_obj.activity_level = activity_level
        profile_obj.goal = goal
        profile_obj.save()

        messages.success(request, "Your profile was saved.")
        return redirect("profile")

    person_data = {
        "weight": profile_obj.weight,
        "height": profile_obj.height,
        "age": profile_obj.age,
        "gender": profile_obj.gender,
        "activityLevel": profile_obj.activity_level,
        "goal": profile_obj.goal,
    }

    return render(request, "tracker/profile.html", {
        "person_data": person_data
    })
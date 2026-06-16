from django.shortcuts import render, redirect
from django.utils import timezone
from django.contrib import messages
from .models import FoodEntry, UserGoal


def dashboard(request):
    today = timezone.now().date()

    entries = FoodEntry.objects.filter(
        date_added=today
    )

    calories_consumed = sum(entry.calories for entry in entries)
    calorie_goal = 2000
    calories_remaining = calorie_goal - calories_consumed

    meals = {
        "breakfast": entries.filter(meal_type="breakfast"),
        "lunch": entries.filter(meal_type="lunch"),
        "dinner": entries.filter(meal_type="dinner"),
        "snack": entries.filter(meal_type="snack"),
    }

    context = {
        "calories_consumed": calories_consumed,
        "calorie_goal": calorie_goal,
        "calories_remaining": calories_remaining,
        "meals": meals,
    }

    return render(request, "tracker/index.html", context)


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
        user=request.user if request.user.is_authenticated else None,
        food_name=food_name,
        calories=calories,
        meal_type=meal_type
    )

    messages.success(request, f"{food_name} was added successfully.")
    return redirect("dashboard")
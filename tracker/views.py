from django.shortcuts import render, redirect
from django.utils import timezone
from .models import FoodEntry, UserGoal

# Dashboard View
def dashboard(request):
    today = timezone.now().date()
    
    entries = FoodEntry.objects.filter(
        #user=request.user,
        date_added=today
    )

    # calorie_goal_obj, created = UserGoal.objects.get_or_create(
    #     #user=request.user,
    #     defaults={"calorie_goal": 2000}
    # )

    calories_consumed = sum(entry.calories for entry in entries)
    # calorie_goal = calorie_goal_obj.calorie_goal
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


# Log Page View
def log(request):
    today = timezone.now().date()

    entries = FoodEntry.objects.filter(
        date_added=today
    )

    meals = {
        "breakfast": entries.filter(meal_type="breakfast"),
        "lunch": entries.filter(meal_type="lunch"),
        "dinner": entries.filter(meal_type="dinner"),
        "snack": entries.filter(meal_type="snack"),
    }

    total_calories = sum(entry.calories for entry in entries)

    context = {
        "meals": meals,
        "total_calories": total_calories,
        "calorie_goal": 2000,
        "remaining": 2000 - total_calories,
    }

    return render(request, "tracker/log.html", context)


def add_food(request):
    food_name = request.POST.get("food_name")
    calories = request.POST.get("calories")
    meal_type = request.POST.get("meal_type")

    FoodEntry.objects.create(
        food_name=food_name,
        calories=calories,
        meal_type=meal_type
    )

    return redirect("dashboard")
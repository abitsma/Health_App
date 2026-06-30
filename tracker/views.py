from django.shortcuts import render, redirect
from django.utils import timezone
from django.contrib import messages
from .models import FoodEntry, UserGoal


def dashboard(request):
    today = timezone.now().date()
    
    entries = FoodEntry.objects.filter(date_added=today)

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
                "protein": 0,
                "carbs": 0,
                "fat": 0,
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

from django.shortcuts import render, redirect
from django.utils import timezone
from .models import FoodEntry

# Dashboard View
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

def add_food(request):

    if request.method == "POST":

        food_name = request.POST.get("food_name")
        calories = request.POST.get("calories")
        protein = request.POST.get("protein") or 0
        carbs = request.POSST.get("carbs") or 0
        fat = request.POST.get("fat") or 0
        meal_type = request.POST.get("meal_type")

        FoodEntry.objects.create(
            food_name=food_name,
            calories=calories,
            protein=protein,
            carbs=carbs,
            fat=fat,
            meal_type=meal_type
        )

    return redirect("dashboard")
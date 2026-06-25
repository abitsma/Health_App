from django.shortcuts import render, redirect
from django.utils import timezone
from django.contrib import messages
from django.http import JsonResponse

from pathlib import Path
from functools import lru_cache
import json

from .models import FoodEntry, UserGoal

# This points to:
# HEALTH_APP / Austins_New_Data / clean_data.json
FOOD_DATA_FILE = (
    Path(__file__).resolve().parent.parent
    / "Austins_New_Data"
    / "clean_data.json"
)


@lru_cache(maxsize=1)
def load_food_database():
    """
    Loads the large JSON food database one time and keeps it cached.

    This matters because the JSON file is very large. Without caching,
    Django would reopen and reread the full file every time someone searches.
    """

    with open(FOOD_DATA_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    # Most likely, your JSON is a list of food dictionaries.
    # Example:
    # [
    #   {"name": "Apple", "calories": 95},
    #   {"name": "Banana", "calories": 105}
    # ]
    if isinstance(data, list):
        records = data

    # Sometimes JSON files store the list inside a bigger dictionary.
    # Example:
    # {
    #   "foods": [...]
    # }
    elif isinstance(data, dict):
        records = []

        for possible_key in ["foods", "data", "items", "results"]:
            if possible_key in data and isinstance(data[possible_key], list):
                records = data[possible_key]
                break

    else:
        records = []

    searchable_foods = []

    for food in records:
        if not isinstance(food, dict):
            continue

        # This makes the search flexible.
        # Since we do not know the exact JSON column names yet,
        # this searches across every value in each food object.
        search_text = " ".join(
            str(value)
            for value in food.values()
            if value is not None
        ).lower()

        searchable_foods.append({
            "search_text": search_text,
            "food": food,
        })

    return searchable_foods


def get_first_available_value(food, possible_keys, default=""):
    """
    Tries several possible JSON key names and returns the first one that exists.

    This helps because your JSON might use 'name', 'food_name',
    'description', 'calories', 'Energy', etc.
    """

    for key in possible_keys:
        value = food.get(key)

        if value not in [None, ""]:
            return value

    return default


def convert_to_int(value, default=0):
    """
    Converts calorie values safely.

    Some JSON files store numbers as strings or decimals,
    so this handles values like '95', '95.0', or 95.0.
    """

    try:
        return int(float(str(value).replace(",", "")))
    except ValueError:
        return default
    except TypeError:
        return default


def search_food_database(request):
    """
    Searches the JSON food database and returns matching foods as JSON.

    Example URL:
    /food-search/?q=apple
    """

    query = request.GET.get("q", "").strip().lower()

    if len(query) < 2:
        return JsonResponse({
            "query": query,
            "count": 0,
            "results": [],
            "message": "Type at least 2 characters to search."
        })

    all_foods = load_food_database()

    results = []

    for item in all_foods:
        food = item["food"]
        search_text = item["search_text"]

        if query not in search_text:
            continue

        name = get_first_available_value(
            food,
            [
                "name",
                "food_name",
                "food",
                "Food",
                "description",
                "Description",
                "item_name",
            ],
            "Unknown food"
        )

        calories = get_first_available_value(
            food,
            [
                "calories",
                "Calories",
                "calorie",
                "Calorie",
                "energy",
                "Energy",
                "energy_kcal",
                "Energy_kcal",
                "kcal",
                "Kcal",
            ],
            0
        )

        protein = get_first_available_value(
            food,
            ["protein", "Protein", "protein_g", "Protein_g"],
            0
        )

        carbs = get_first_available_value(
            food,
            ["carbs", "Carbs", "carbohydrates", "Carbohydrates", "carbohydrate_g"],
            0
        )

        fat = get_first_available_value(
            food,
            ["fat", "Fat", "fat_g", "Fat_g", "total_fat"],
            0
        )

        results.append({
            "name": str(name),
            "calories": convert_to_int(calories),
            "protein": protein,
            "carbs": carbs,
            "fat": fat,
        })

        # Important: stop early so we do not return hundreds/thousands of results.
        if len(results) >= 25:
            break

    return JsonResponse({
        "query": query,
        "count": len(results),
        "results": results,
    })


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

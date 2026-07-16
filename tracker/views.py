import json
from django.shortcuts import render, redirect
from django.utils import timezone
from django.contrib import messages
from .models import FoodEntry, UserProfile
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from datetime import datetime, timedelta
from pathlib import Path

def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)

        if form.is_valid():
            user = form.save()

            UserProfile.objects.create(
                user=user
            )

            login(request, user)

            return redirect("dashboard")

    else:
        form = UserCreationForm()

    return render(request, "registration/register.html", {
        "form": form
    })



@login_required
def dashboard(request):
    today = timezone.localdate()

    entries = FoodEntry.objects.filter(
        user=request.user,
        date_added=today
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

        meal_entries = entries.filter(
            meal_type=meal_value
        )

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

    date_string = request.GET.get("date")

    if date_string:
        try:
            selected_date = datetime.strptime(
                date_string,
                "%Y-%m-%d"
            ).date()
        except ValueError:
            selected_date = timezone.localdate()
    else:
        selected_date = timezone.localdate()

    print("Today:", timezone.localdate())
    print("Selected:", selected_date)

    entries = FoodEntry.objects.filter(
        user=request.user,
        date_added=selected_date
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

        meal_entries = entries.filter(
            meal_type=meal_value
        )

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
        "selected_date": selected_date,
        "previous_date": selected_date - timedelta(days=1),
        "next_date": selected_date + timedelta(days=1),
    }

    return render(
        request,
        "tracker/log.html",
        context
    )



@login_required
def add_food(request):

    # -----------------------------
    # Search the food database
    # -----------------------------
    if request.method == "GET":

        meal_type = request.GET.get("mealType", "")
        search = request.GET.get("search", "").strip()

        search_results = []

        if search:

            json_file = (
                Path(__file__).resolve().parent.parent
                / "Austins_New_Data"
                / "clean_data.json"
            )

            with open(json_file, "r", encoding="utf-8") as file:
                foods = json.load(file)

            for food in foods:

                name = food.get("product_name", "")

                if search.lower() in name.lower():

                    search_results.append({
                        "name": name,
                        "calories": round(food.get("calories_100g") or 0),
                        "protein": round(food.get("proteins_100g") or 0),
                        "carbs": round(food.get("carbohydrates_100g") or 0),
                        "fat": round(food.get("fat_100g") or 0),
                    })

                if len(search_results) >= 10:
                    break

        return render(
            request,
            "tracker/add-food.html",
            {
                "meal_type": meal_type,
                "search": search,
                "results": search_results,
            },
        )

    # -----------------------------
    # Existing save code
    # -----------------------------

    food_name = request.POST.get("food_name", "").strip()
    calories_text = request.POST.get("calories", "").strip()
    protein_text = request.POST.get("protein", "").strip()
    carbs_text = request.POST.get("carbs", "").strip()
    fat_text = request.POST.get("fat", "").strip()
    meal_type = request.POST.get("meal_type", "").strip()

    valid_meal_types = [
        "breakfast",
        "lunch",
        "dinner",
        "snack",
    ]

    if not food_name:

        messages.error(
            request,
            "Food name is required."
        )

        return redirect("add_food")

    try:

        calories = int(calories_text)
        protein = int(protein_text)
        carbs = int(carbs_text)
        fat = int(fat_text)

    except ValueError:

        messages.error(
            request,
            "Calories and macros must be whole numbers."
        )

        return redirect("add_food")

    if meal_type not in valid_meal_types:

        messages.error(
            request,
            "Please select a meal type."
        )

        return redirect("add_food")

    FoodEntry.objects.create(

        user=request.user,
        food_name=food_name,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat,
        meal_type=meal_type

    )

    messages.success(
        request,
        f"{food_name} was added successfully."
    )

    return redirect("dashboard")



@login_required
def profile(request):

    profile_obj, created = UserProfile.objects.get_or_create(
    user=request.user
)


    if request.method == "POST":

        try:

            weight = float(
                request.POST.get("weight", 0)
            )

            height = float(
                request.POST.get("height", 0)
            )

            age = int(
                request.POST.get("age", 0)
            )


        except (TypeError, ValueError):

            messages.error(
                request,
                "Weight, height, and age must be valid numbers."
            )

            return redirect("profile")


        gender = request.POST.get(
            "gender"
        )

        activity_level = request.POST.get(
            "activityLevel"
        )

        goal = request.POST.get(
            "goal"
        )


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


        messages.success(
            request,
            "Your profile was saved."
        )

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
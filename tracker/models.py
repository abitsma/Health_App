from django.db import models
from django.contrib.auth.models import User

# FoodEntry model allows us to enter meals into site
class FoodEntry(models.Model):
    MEAL_CHOICES = [
        ("breakfast", "Breakfast"),
        ("lunch", "Lunch"),
        ("dinner", "Dinner"),
        ("snack", "Snack"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    food_name = models.CharField(max_length=100)
    calories = models.IntegerField()
    protein = models.IntegerField(default=0)
    carbs = models.IntegerField(default=0)
    fat = models.IntegerField(default=0)
    meal_type= models.CharField(max_length=20, choices=MEAL_CHOICES)
    date_added = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.food_name} - {self.calories} cal"

class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )
    
    weight = models.FloatField(default=0)
    height = models.FloatField(default=0)
    age = models.IntegerField(default=0)
    gender = models.CharField(max_length=10, default="male")
    activity_level = models.CharField(max_length=20, default="sedentary")
    goal = models.CharField(max_length=20, default="maintain")

    def __str__(self):
        return "User Profile"
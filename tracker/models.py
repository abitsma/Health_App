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
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    food_name = models.CharField(max_length=100)
    calories = models.IntegerField()
    meal_type= models.CharField(max_length=20, choices=MEAL_CHOICES)
    date_added = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.food_name} - {self.calories} cal"

class UserGoal(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    calorie_goal = models.IntegerField(default=2000)

    def __str__(self):
        return f"{self.calorie_goal} cal"
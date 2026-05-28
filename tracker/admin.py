from django.contrib import admin
from .models import FoodEntry, UserGoal

# Register your models here.
admin.site.register(FoodEntry)
admin.site.register(UserGoal)
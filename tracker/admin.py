from django.contrib import admin
from .models import FoodEntry, UserProfile

# Register your models here.
admin.site.register(FoodEntry)
admin.site.register(UserProfile)
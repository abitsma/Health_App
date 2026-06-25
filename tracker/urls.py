from django.urls import path
from . import views

# Connecting pages to tracker requests
urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("log/", views.log, name="log"),
    path("add-food/", views.add_food, name="add_food"),

    # Searches the large JSON food database
    path("food-search/", views.search_food_database, name="search_food_database"),
]
from django.urls import path
from . import views

# Connecting pages to tracker requests
urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("log/", views.log, name="log"),
    path("add-food/", views.add_food, name="add_food"),
    path("profile/", views.profile, name="profile"),
]
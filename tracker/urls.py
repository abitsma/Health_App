from django.urls import path
from . import views

#Connecting pages to tracker requests
urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("add-food/", views.add_food, name="add_food"),
]
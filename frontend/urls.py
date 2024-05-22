from django.urls import path
from . import views
urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.user_signup, name='user_signup'),
    path('login/', views.user_login, name='user_login'),
    path('profile/', views.user_profile, name='user_profile'),
    path('add_recipe/', views.add_recipe, name='add-recipe'),
    path('recipe_details/', views.recipe_details, name='recipe-details'),
 
]
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter



# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('list/', views.RecipeList, name="recipe-list"),
    path('list/<int:id>', views.RecipeDetail, name="recipe-detail"),
    path('create/', views.RecipeListCreateView.as_view(), name='create-view'),
    path('update/<int:pk>/', views.RecipeUpdateView.as_view(), name='update-view'),
    path('delete/<int:pk>/', views.RecipeDeleteView.as_view(), name='delete-view'),
   
]


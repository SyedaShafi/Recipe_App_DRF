from django.urls import path
from . import views
urlpatterns = [
    path('', views.allAPIView),
    path('list/', views.ContactListView.as_view()),
    path('create/', views.ContactCreateView.as_view()),
]
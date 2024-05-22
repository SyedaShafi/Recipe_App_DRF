from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter



# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('list/', views.CommentList, name="comment-list"),
    path('list/<int:id>', views.CommentDetail, name="recipe-detail"),
    path('create/', views.CommentListCreateView.as_view(), name='comment-create'),
    path('update/<int:pk>/', views.CommentUpdateView.as_view(), name='comment-update'),
    path('delete/<int:pk>/', views.CommentDeleteView.as_view(), name='comment-delete'),
]


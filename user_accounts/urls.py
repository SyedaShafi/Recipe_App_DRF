from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('list', views.UserModelViewset)


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('signup/', views.RegistrationAPIView.as_view(), name='signup'),
    path('logout/', views.UserLogoutAPIView, name='logout'),
    path('active/<uid64>/<token>/', views.activate, name = 'activate'),
    path('update/', views.UserUpdateView.as_view(), name = 'update'),
   
]
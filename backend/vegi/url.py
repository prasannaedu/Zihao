from django.urls import path
from vegi import views
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('recipes/', views.receipes, name='receipes'),
    path('recipes/create/', views.create_receipe, name='create_receipe'),
    path('recipes/update/<int:id>/', views.update_receipe, name='update_receipe'),
    path('recipes/delete/<int:id>/', views.delete_receipe, name='delete_receipe'),
    path('login/', views.log_in, name='login'),
    path('logout/', views.logout_page, name='logout'),
    path('register/', views.register, name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', views.protected_view, name='protected'),

]










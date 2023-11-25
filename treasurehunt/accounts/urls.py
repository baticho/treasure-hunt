from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

app_name = 'accounts'

urlpatterns = [
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', TokenRefreshView.as_view(), name='logout'),
    path('register/', views.RegisterUser.as_view(), name='register'),
    path('change-password/<int:pk>/', views.ChangePasswordView.as_view(), name='auth-change-password'),
    path('update-user/<int:pk>/', views.UpdateUserView.as_view(), name='update-user'),
    path('confirm-email/<str:uidb64>/<str:token>/', views.ConfirmEmailView.as_view(), name='confirm-email'),
    path('resend-confirm-email/', views.ResendEmailView.as_view(), name='resend-confirm-email'),
    path('reset-password-email/', views.PasswordResetView.as_view(), name='reset-password-email'),
    path('reset-password-confirm/<int:pk>/', views.PasswordResetConfirmView.as_view(), name='reset-password-confirm'),
]

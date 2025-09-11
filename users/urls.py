from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'users'

urlpatterns = [
    # Authentication endpoints
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/logout/', views.logout_view, name='logout'),
    
    # Password management
    path('auth/password/change/', views.PasswordChangeView.as_view(), name='password_change'),
    path('auth/password/reset/', views.password_reset_request, name='password_reset'),
    path('auth/email/verify/', views.email_verification, name='email_verify'),
    
    # User profile endpoints
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('profile/update/', views.UserUpdateView.as_view(), name='user_update'),
    path('dashboard/', views.user_dashboard_data, name='dashboard'),
    
    # Role-specific profiles
    path('student/profile/', views.StudentProfileView.as_view(), name='student_profile'),
    path('tutor/profile/', views.TutorProfileView.as_view(), name='tutor_profile'),
]
from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    # Dashboard analytics
    path('dashboard/', views.dashboard_analytics, name='dashboard'),
    path('user-activity/', views.UserActivityView.as_view(), name='user_activity'),
    
    # Course analytics
    path('courses/<int:course_id>/', views.course_analytics, name='course_analytics'),
    path('courses/<int:course_id>/students/', views.course_student_analytics, name='course_student_analytics'),
    
    # Platform-wide analytics (admin only)
    path('platform/', views.platform_analytics, name='platform_analytics'),
]
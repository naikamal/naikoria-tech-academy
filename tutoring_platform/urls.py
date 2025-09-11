"""
Naikoria Tech Academy - URL Configuration
AI-Powered Online Tutoring Platform by Naik Amal Shah
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

def welcome_view(request):
    """Welcome page for Naikoria Tech Academy API"""
    return JsonResponse({
        "message": "Welcome to Naikoria Tech Academy! 🎓",
        "description": "AI-Powered Online Tutoring Platform by Naik Amal Shah",
        "status": "✅ Platform is running successfully",
        "version": "1.0.0",
        "endpoints": {
            "api": "/api/v1/",
            "documentation": "/api/docs/",
            "admin": "/admin/",
            "redoc": "/api/redoc/"
        },
        "features": [
            "👥 User Management (Students & Tutors)",
            "📚 Course Management",
            "🎥 Live Virtual Classroom",
            "💳 Payment System",
            "💬 Discussion Forum", 
            "📊 Analytics Dashboard",
            "🤖 AI-Powered Features"
        ]
    })

# API URL patterns
api_patterns = [
    path('users/', include('users.urls')),
    path('courses/', include('courses.urls')),
    path('classroom/', include('classroom.urls')),
    path('payments/', include('payments.urls')),
    path('forum/', include('forum.urls')),
    path('analytics/', include('analytics.urls')),
    path('ai/', include('ai_features.urls')),
]

urlpatterns = [
    # Welcome page
    path('', welcome_view, name='welcome'),
    
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/v1/', include(api_patterns)),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

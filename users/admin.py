from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import StudentProfile, TutorProfile

User = get_user_model()

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'user_type', 'is_verified', 'is_premium', 'date_joined')
    list_filter = ('user_type', 'is_verified', 'is_premium', 'is_staff', 'is_active')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile Information', {
            'fields': ('user_type', 'phone_number', 'avatar', 'date_of_birth', 'bio')
        }),
        ('Account Status', {
            'fields': ('is_verified', 'is_premium')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Profile Information', {
            'fields': ('email', 'user_type', 'first_name', 'last_name')
        }),
    )

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'grade_level', 'school', 'timezone')
    list_filter = ('grade_level', 'timezone')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'school')
    raw_id_fields = ('user',)

@admin.register(TutorProfile)
class TutorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'qualifications', 'experience_years', 'hourly_rate', 'rating', 'is_available')
    list_filter = ('qualifications', 'is_available', 'experience_years')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'title')
    list_editable = ('is_available', 'hourly_rate')
    raw_id_fields = ('user',)

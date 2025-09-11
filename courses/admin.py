from django.contrib import admin
from .models import Category, Course, Lesson, Enrollment, LessonProgress, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0
    fields = ['title', 'lesson_type', 'order', 'is_free_preview']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'tutor', 'category', 'status', 'difficulty', 'price', 'rating', 'created_at']
    list_filter = ['status', 'difficulty', 'category', 'is_featured', 'created_at']
    search_fields = ['title', 'description', 'tutor__email']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [LessonInline]
    readonly_fields = ['rating', 'total_ratings']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'lesson_type', 'order', 'is_free_preview']
    list_filter = ['lesson_type', 'is_free_preview', 'course__category']
    search_fields = ['title', 'description', 'course__title']

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'status', 'progress', 'enrolled_at']
    list_filter = ['status', 'enrolled_at', 'course__category']
    search_fields = ['student__email', 'course__title']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['course', 'student', 'rating', 'created_at']
    list_filter = ['rating', 'created_at', 'course__category']
    search_fields = ['course__title', 'student__email', 'comment']

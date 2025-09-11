from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Course, Lesson
from classroom.models import LiveSession

User = get_user_model()

class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=50)
    content_type = models.CharField(max_length=50)
    content_id = models.PositiveIntegerField()
    metadata = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_activities'
        ordering = ['-timestamp']

class CourseAnalytics(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='analytics')
    total_enrollments = models.PositiveIntegerField(default=0)
    completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'course_analytics'

class LessonAnalytics(models.Model):
    lesson = models.OneToOneField(Lesson, on_delete=models.CASCADE, related_name='analytics')
    total_views = models.PositiveIntegerField(default=0)
    avg_watch_time = models.DurationField(blank=True, null=True)
    completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    drop_off_points = models.JSONField(default=list)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lesson_analytics'

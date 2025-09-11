from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Course
import uuid

User = get_user_model()

class LiveSession(models.Model):
    SESSION_STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('live', 'Live'),
        ('ended', 'Ended'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='live_sessions')
    tutor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_sessions')
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    scheduled_at = models.DateTimeField()
    started_at = models.DateTimeField(blank=True, null=True)
    ended_at = models.DateTimeField(blank=True, null=True)
    duration_minutes = models.PositiveIntegerField(default=60)
    
    status = models.CharField(max_length=15, choices=SESSION_STATUS_CHOICES, default='scheduled')
    max_participants = models.PositiveIntegerField(default=50)
    
    zoom_meeting_id = models.CharField(max_length=100, blank=True)
    zoom_join_url = models.URLField(blank=True)
    zoom_password = models.CharField(max_length=50, blank=True)
    
    recording_url = models.URLField(blank=True)
    is_recorded = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'live_sessions'
        ordering = ['scheduled_at']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"

class SessionAttendance(models.Model):
    session = models.ForeignKey(LiveSession, on_delete=models.CASCADE, related_name='attendances')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='session_attendances')
    
    joined_at = models.DateTimeField(blank=True, null=True)
    left_at = models.DateTimeField(blank=True, null=True)
    duration_minutes = models.PositiveIntegerField(default=0)
    is_present = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'session_attendance'
        unique_together = ['session', 'student']

class Whiteboard(models.Model):
    session = models.OneToOneField(LiveSession, on_delete=models.CASCADE, related_name='whiteboard')
    content = models.JSONField(default=dict)
    last_updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'whiteboards'

class ChatMessage(models.Model):
    MESSAGE_TYPE_CHOICES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('file', 'File'),
        ('poll', 'Poll'),
    ]
    
    session = models.ForeignKey(LiveSession, on_delete=models.CASCADE, related_name='chat_messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPE_CHOICES, default='text')
    content = models.TextField()
    file_url = models.URLField(blank=True)
    
    is_private = models.BooleanField(default=False)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='private_messages')
    
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'chat_messages'
        ordering = ['timestamp']

class Poll(models.Model):
    session = models.ForeignKey(LiveSession, on_delete=models.CASCADE, related_name='polls')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_polls')
    
    question = models.CharField(max_length=500)
    options = models.JSONField(default=list)
    is_multiple_choice = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    ends_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'polls'

class PollResponse(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='responses')
    respondent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='poll_responses')
    selected_options = models.JSONField(default=list)
    responded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'poll_responses'
        unique_together = ['poll', 'respondent']

class Assignment(models.Model):
    ASSIGNMENT_TYPE_CHOICES = [
        ('essay', 'Essay'),
        ('quiz', 'Quiz'),
        ('project', 'Project'),
        ('coding', 'Coding Challenge'),
        ('presentation', 'Presentation'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('closed', 'Closed'),
    ]
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_assignments')
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    assignment_type = models.CharField(max_length=20, choices=ASSIGNMENT_TYPE_CHOICES)
    
    instructions = models.TextField()
    max_score = models.PositiveIntegerField(default=100)
    
    due_date = models.DateTimeField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='draft')
    
    attachments = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'assignments'
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Submission(models.Model):
    SUBMISSION_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('graded', 'Graded'),
        ('returned', 'Returned'),
    ]
    
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    
    content = models.TextField(blank=True)
    attachments = models.JSONField(default=list)
    
    status = models.CharField(max_length=15, choices=SUBMISSION_STATUS_CHOICES, default='draft')
    score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    feedback = models.TextField(blank=True)
    
    submitted_at = models.DateTimeField(blank=True, null=True)
    graded_at = models.DateTimeField(blank=True, null=True)
    graded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='graded_submissions')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'submissions'
        unique_together = ['assignment', 'student']
    
    def __str__(self):
        return f"{self.assignment.title} - {self.student.email}"

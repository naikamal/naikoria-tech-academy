"""
Celery configuration for Naikoria Tech Academy
Background tasks for AI processing, notifications, and analytics
"""
from celery import Celery
import os
import sys

# Add project root to path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.insert(0, project_root)

# Create Celery app
app = Celery('naikoria_tasks')

# Configure Celery
app.config_from_object({
    'broker_url': 'redis://localhost:6379/0',
    'result_backend': 'redis://localhost:6379/0',
    'task_serializer': 'json',
    'result_serializer': 'json',
    'accept_content': ['json'],
    'timezone': 'UTC',
    'enable_utc': True,
    
    # Task routing
    'task_routes': {
        'ai_tasks.*': {'queue': 'ai_queue'},
        'notification_tasks.*': {'queue': 'notification_queue'},
        'analytics_tasks.*': {'queue': 'analytics_queue'},
        'video_tasks.*': {'queue': 'video_queue'},
    },
    
    # Worker configuration
    'worker_prefetch_multiplier': 1,
    'task_acks_late': True,
    'worker_max_tasks_per_child': 1000,
    
    # Task retry configuration
    'task_default_retry_delay': 60,
    'task_max_retries': 3,
    
    # Beat schedule for periodic tasks
    'beat_schedule': {
        'send-daily-reminders': {
            'task': 'notification_tasks.send_daily_reminders',
            'schedule': 3600.0,  # Every hour
        },
        'update-course-analytics': {
            'task': 'analytics_tasks.update_course_analytics',
            'schedule': 1800.0,  # Every 30 minutes
        },
        'cleanup-expired-sessions': {
            'task': 'cleanup_tasks.cleanup_expired_sessions',
            'schedule': 3600.0,  # Every hour
        },
    },
})

# Auto-discover tasks
app.autodiscover_tasks([
    'celery_tasks.ai_tasks',
    'celery_tasks.notification_tasks', 
    'celery_tasks.analytics_tasks',
    'celery_tasks.video_tasks',
    'celery_tasks.cleanup_tasks',
])

if __name__ == '__main__':
    app.start()
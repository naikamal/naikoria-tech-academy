from django.urls import path
from . import views

app_name = 'ai_features'

urlpatterns = [
    # AI-powered content generation
    path('generate/quiz/', views.generate_quiz, name='generate_quiz'),
    path('generate/summary/', views.generate_summary, name='generate_summary'),
    path('generate/outline/', views.generate_course_outline, name='generate_outline'),
    
    # AI tutoring assistant
    path('tutor/chat/', views.ai_tutor_chat, name='ai_tutor_chat'),
    path('tutor/explain/', views.explain_concept, name='explain_concept'),
    
    # Content analysis
    path('analyze/transcript/', views.analyze_transcript, name='analyze_transcript'),
    path('analyze/assignment/', views.analyze_assignment, name='analyze_assignment'),
    
    # Agent management
    path('agents/status/', views.agent_status, name='agent_status'),
    path('agents/feedback/', views.agent_feedback, name='agent_feedback'),
]
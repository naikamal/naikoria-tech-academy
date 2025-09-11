from django.urls import path
from . import views

app_name = 'classroom'

urlpatterns = [
    # Live sessions
    path('sessions/', views.LiveSessionListView.as_view(), name='session_list'),
    path('sessions/<uuid:pk>/', views.LiveSessionDetailView.as_view(), name='session_detail'),
    path('sessions/create/', views.LiveSessionCreateView.as_view(), name='session_create'),
    path('sessions/<uuid:pk>/join/', views.join_session, name='join_session'),
    path('sessions/<uuid:pk>/leave/', views.leave_session, name='leave_session'),
    path('sessions/<uuid:pk>/start/', views.start_session, name='start_session'),
    path('sessions/<uuid:pk>/end/', views.end_session, name='end_session'),
    
    # Assignments
    path('assignments/', views.AssignmentListView.as_view(), name='assignment_list'),
    path('assignments/<int:pk>/', views.AssignmentDetailView.as_view(), name='assignment_detail'),
    path('assignments/create/', views.AssignmentCreateView.as_view(), name='assignment_create'),
    path('assignments/<int:pk>/submit/', views.SubmissionCreateView.as_view(), name='submit_assignment'),
    
    # Chat and communication
    path('sessions/<uuid:session_id>/chat/', views.SessionChatView.as_view(), name='session_chat'),
    path('sessions/<uuid:session_id>/polls/', views.SessionPollsView.as_view(), name='session_polls'),
]
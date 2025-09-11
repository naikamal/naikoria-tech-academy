from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import LiveSession, Assignment, Submission, ChatMessage, Poll, SessionAttendance
from courses.models import Course
from django.shortcuts import get_object_or_404
import uuid

class LiveSessionListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        user = request.user
        
        if user.user_type == 'tutor':
            # Tutors see sessions they're hosting
            sessions = LiveSession.objects.filter(tutor=user).order_by('-scheduled_at')
        else:
            # Students see sessions for enrolled courses
            enrolled_courses = request.user.enrollments.values_list('course_id', flat=True)
            sessions = LiveSession.objects.filter(
                course_id__in=enrolled_courses
            ).order_by('-scheduled_at')
        
        session_data = []
        for session in sessions:
            session_data.append({
                'id': session.id,
                'title': session.title,
                'course': session.course.title,
                'tutor': f"{session.tutor.first_name} {session.tutor.last_name}",
                'scheduled_at': session.scheduled_at,
                'duration_minutes': session.duration_minutes,
                'is_active': session.is_active,
                'max_participants': session.max_participants,
                'meeting_url': session.meeting_url if session.is_active else None,
                'description': session.description
            })
        
        return Response({
            'sessions': session_data,
            'count': len(session_data)
        })

class LiveSessionDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def retrieve(self, request, pk):
        try:
            session = LiveSession.objects.get(id=pk)
            
            # Check permissions
            user = request.user
            if user.user_type == 'tutor' and session.tutor != user:
                return Response({'error': 'Permission denied'}, status=403)
            elif user.user_type == 'student':
                enrolled = user.enrollments.filter(course=session.course).exists()
                if not enrolled:
                    return Response({'error': 'Not enrolled in this course'}, status=403)
            
            # Get session attendees
            attendees = SessionAttendance.objects.filter(session=session).select_related('student')
            attendee_list = [{
                'id': att.student.id,
                'name': f"{att.student.first_name} {att.student.last_name}",
                'joined_at': att.joined_at
            } for att in attendees]
            
            return Response({
                'id': session.id,
                'title': session.title,
                'course': session.course.title,
                'tutor': f"{session.tutor.first_name} {session.tutor.last_name}",
                'scheduled_at': session.scheduled_at,
                'duration_minutes': session.duration_minutes,
                'is_active': session.is_active,
                'max_participants': session.max_participants,
                'meeting_url': session.meeting_url,
                'description': session.description,
                'attendees': attendee_list,
                'total_attendees': len(attendee_list)
            })
        except LiveSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=404)

class LiveSessionCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request):
        user = request.user
        if user.user_type != 'tutor':
            return Response({'error': 'Only tutors can create sessions'}, status=403)
        
        data = request.data
        try:
            course = Course.objects.get(id=data.get('course_id'))
            
            # Generate a unique meeting URL (placeholder - would integrate with actual video service)
            meeting_url = f"https://meet.naikoria.com/{uuid.uuid4()}"
            
            session = LiveSession.objects.create(
                title=data.get('title', f"{course.title} - Live Session"),
                course=course,
                tutor=user,
                scheduled_at=data.get('scheduled_at'),
                duration_minutes=data.get('duration_minutes', 60),
                max_participants=data.get('max_participants', 50),
                meeting_url=meeting_url,
                description=data.get('description', ''),
                is_active=False
            )
            
            return Response({
                'message': 'Session created successfully',
                'session': {
                    'id': session.id,
                    'title': session.title,
                    'meeting_url': meeting_url,
                    'scheduled_at': session.scheduled_at
                }
            }, status=201)
            
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class AssignmentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        return Response({'message': 'Assignments feature coming soon'})

class AssignmentDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def retrieve(self, request, pk):
        return Response({'message': 'Assignment details feature coming soon'})

class AssignmentCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request):
        return Response({'message': 'Assignment creation feature coming soon'})

class SubmissionCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, pk):
        return Response({'message': 'Assignment submission feature coming soon'})

class SessionChatView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request, session_id):
        return Response({'message': 'Session chat feature coming soon'})

class SessionPollsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request, session_id):
        return Response({'message': 'Session polls feature coming soon'})

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_session(request, pk):
    try:
        session = LiveSession.objects.get(id=pk)
        user = request.user
        
        # Check if user is enrolled in the course
        if user.user_type == 'student':
            enrolled = user.enrollments.filter(course=session.course).exists()
            if not enrolled:
                return Response({'error': 'Not enrolled in this course'}, status=403)
        elif user.user_type != 'tutor' or session.tutor != user:
            return Response({'error': 'Permission denied'}, status=403)
        
        # Check if session is active
        if not session.is_active:
            return Response({'error': 'Session is not active'}, status=400)
        
        # Create or update attendance record
        attendance, created = SessionAttendance.objects.get_or_create(
            session=session,
            student=user,
            defaults={'joined_at': timezone.now()}
        )
        
        if not created:
            attendance.joined_at = timezone.now()
            attendance.save()
        
        return Response({
            'message': 'Successfully joined session',
            'meeting_url': session.meeting_url,
            'session_title': session.title
        })
        
    except LiveSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=404)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def leave_session(request, pk):
    try:
        session = LiveSession.objects.get(id=pk)
        user = request.user
        
        # Update attendance record with leave time
        try:
            attendance = SessionAttendance.objects.get(session=session, student=user)
            attendance.left_at = timezone.now()
            
            # Calculate session duration
            if attendance.joined_at:
                duration = timezone.now() - attendance.joined_at
                attendance.duration_minutes = int(duration.total_seconds() / 60)
            
            attendance.save()
            
            return Response({'message': 'Successfully left session'})
        except SessionAttendance.DoesNotExist:
            return Response({'message': 'You were not in this session'})
        
    except LiveSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=404)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def start_session(request, pk):
    """Start a live session (tutors only)"""
    try:
        session = LiveSession.objects.get(id=pk)
        user = request.user
        
        if user.user_type != 'tutor' or session.tutor != user:
            return Response({'error': 'Only the session tutor can start the session'}, status=403)
        
        session.is_active = True
        session.started_at = timezone.now()
        session.save()
        
        return Response({
            'message': 'Session started successfully',
            'meeting_url': session.meeting_url
        })
        
    except LiveSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=404)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def end_session(request, pk):
    """End a live session (tutors only)"""
    try:
        session = LiveSession.objects.get(id=pk)
        user = request.user
        
        if user.user_type != 'tutor' or session.tutor != user:
            return Response({'error': 'Only the session tutor can end the session'}, status=403)
        
        session.is_active = False
        session.ended_at = timezone.now()
        session.save()
        
        # Update all active attendances
        active_attendances = SessionAttendance.objects.filter(
            session=session, 
            left_at__isnull=True
        )
        for attendance in active_attendances:
            attendance.left_at = timezone.now()
            if attendance.joined_at:
                duration = timezone.now() - attendance.joined_at
                attendance.duration_minutes = int(duration.total_seconds() / 60)
            attendance.save()
        
        return Response({'message': 'Session ended successfully'})
        
    except LiveSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=404)

from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import update_session_auth_hash
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from django.urls import reverse
from .models import User, StudentProfile, TutorProfile
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    UserUpdateSerializer,
    StudentProfileSerializer,
    TutorProfileSerializer,
    PasswordChangeSerializer
)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        
        # Add custom claims to tokens
        access['user_type'] = user.user_type
        access['email'] = user.email
        access['first_name'] = user.first_name
        access['last_name'] = user.last_name
        
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(access),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class StudentProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        if self.request.user.user_type != 'student':
            return Response(
                {'error': 'Only students can access this endpoint'},
                status=status.HTTP_403_FORBIDDEN
            )
        profile, created = StudentProfile.objects.get_or_create(
            user=self.request.user
        )
        return profile

class TutorProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = TutorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        if self.request.user.user_type != 'tutor':
            return Response(
                {'error': 'Only tutors can access this endpoint'},
                status=status.HTTP_403_FORBIDDEN
            )
        profile, created = TutorProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'title': '',
                'qualifications': 'bachelor',
                'hourly_rate': 0.00
            }
        )
        return profile

class PasswordChangeView(generics.GenericAPIView):
    serializer_class = PasswordChangeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Update session auth hash to prevent logout
        update_session_auth_hash(request, user)
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_request(request):
    email = request.data.get('email')
    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
        # Generate reset token (in production, use proper token generation)
        reset_token = get_random_string(32)
        
        # Store token in user model or cache (simplified for demo)
        # In production, use proper token storage with expiration
        
        # Send reset email
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{reset_token}"
        send_mail(
            'Password Reset - Naikoria Tech Academy',
            f'Click here to reset your password: {reset_url}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        return Response({
            'message': 'Password reset email sent'
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        # Return same response for security (don't reveal if email exists)
        return Response({
            'message': 'Password reset email sent'
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def email_verification(request):
    # Email verification logic here
    # This is a placeholder for email verification functionality
    return Response({
        'message': 'Email verification feature coming soon'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_dashboard_data(request):
    user = request.user
    
    if user.user_type == 'student':
        # Get student-specific dashboard data
        try:
            profile = user.student_profile
            enrollments = user.enrollments.filter(status='active')
            return Response({
                'user_type': 'student',
                'profile': StudentProfileSerializer(profile).data,
                'active_enrollments': enrollments.count(),
                'completed_courses': user.enrollments.filter(status='completed').count(),
            })
        except StudentProfile.DoesNotExist:
            StudentProfile.objects.create(user=user)
            return Response({'message': 'Profile created'})
    
    elif user.user_type == 'tutor':
        # Get tutor-specific dashboard data
        try:
            profile = user.tutor_profile
            courses = user.courses.filter(status='published')
            return Response({
                'user_type': 'tutor',
                'profile': TutorProfileSerializer(profile).data,
                'total_courses': courses.count(),
                'total_students': sum(course.enrollments.count() for course in courses),
            })
        except TutorProfile.DoesNotExist:
            TutorProfile.objects.create(
                user=user,
                title='',
                qualifications='bachelor',
                hourly_rate=0.00
            )
            return Response({'message': 'Profile created'})
    
    return Response({
        'user_type': user.user_type,
        'message': 'Dashboard data loaded'
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Invalid token'
        }, status=status.HTTP_400_BAD_REQUEST)

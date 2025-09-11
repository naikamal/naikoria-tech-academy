from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg
from .models import Category, Course, Lesson, Enrollment, LessonProgress, Review
from .serializers import (
    CategorySerializer,
    CourseDetailSerializer,
    CourseListSerializer,
    CourseCreateUpdateSerializer,
    LessonSerializer,
    EnrollmentSerializer,
    LessonProgressSerializer,
    ReviewSerializer
)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class CourseListView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'difficulty', 'is_featured']
    search_fields = ['title', 'description', 'short_description']
    ordering_fields = ['created_at', 'rating', 'price']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Course.objects.filter(status='published').select_related('tutor', 'category')

class CourseDetailView(generics.RetrieveAPIView):
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Course.objects.filter(status='published').select_related('tutor', 'category').prefetch_related('lessons')

class CourseCreateView(generics.CreateAPIView):
    serializer_class = CourseCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)

class CourseUpdateView(generics.UpdateAPIView):
    serializer_class = CourseCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Course.objects.filter(tutor=self.request.user)

class CourseDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Course.objects.filter(tutor=self.request.user)

class TutorCoursesView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Course.objects.filter(tutor=self.request.user).select_related('category')

class LessonListView(generics.ListAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        return Lesson.objects.filter(course_id=course_id).order_by('order')

class LessonDetailView(generics.RetrieveAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        return Lesson.objects.filter(course_id=course_id)

class LessonCreateView(generics.CreateAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        course_id = self.kwargs.get('course_id')
        course = Course.objects.get(id=course_id, tutor=self.request.user)
        serializer.save(course=course)

class LessonUpdateView(generics.UpdateAPIView):
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        return Lesson.objects.filter(course_id=course_id, course__tutor=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def enroll_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id, status='published')
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.user.user_type != 'student':
        return Response({'error': 'Only students can enroll in courses'}, status=status.HTTP_403_FORBIDDEN)
    
    enrollment, created = Enrollment.objects.get_or_create(
        student=request.user,
        course=course,
        defaults={'status': 'active'}
    )
    
    if not created:
        if enrollment.status == 'active':
            return Response({'message': 'Already enrolled'}, status=status.HTTP_200_OK)
        else:
            enrollment.status = 'active'
            enrollment.save()
    
    return Response({
        'message': 'Successfully enrolled',
        'enrollment': EnrollmentSerializer(enrollment).data
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def unenroll_course(request, course_id):
    try:
        enrollment = Enrollment.objects.get(
            student=request.user,
            course_id=course_id,
            status='active'
        )
        enrollment.status = 'dropped'
        enrollment.save()
        
        return Response({'message': 'Successfully unenrolled'}, status=status.HTTP_200_OK)
    except Enrollment.DoesNotExist:
        return Response({'error': 'Enrollment not found'}, status=status.HTTP_404_NOT_FOUND)

class StudentEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user).select_related('course')

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_lesson_complete(request, lesson_id):
    try:
        lesson = Lesson.objects.get(id=lesson_id)
        enrollment = Enrollment.objects.get(
            student=request.user,
            course=lesson.course,
            status='active'
        )
        
        progress, created = LessonProgress.objects.get_or_create(
            enrollment=enrollment,
            lesson=lesson,
            defaults={'is_completed': True}
        )
        
        if not created:
            progress.is_completed = True
            progress.save()
        
        # Update overall course progress
        total_lessons = lesson.course.lessons.count()
        completed_lessons = LessonProgress.objects.filter(
            enrollment=enrollment,
            is_completed=True
        ).count()
        
        enrollment.progress = (completed_lessons / total_lessons) * 100 if total_lessons > 0 else 0
        if enrollment.progress >= 100:
            enrollment.status = 'completed'
        enrollment.save()
        
        return Response({
            'message': 'Lesson marked as complete',
            'course_progress': enrollment.progress
        }, status=status.HTTP_200_OK)
        
    except (Lesson.DoesNotExist, Enrollment.DoesNotExist):
        return Response({'error': 'Lesson or enrollment not found'}, status=status.HTTP_404_NOT_FOUND)

class CourseReviewsView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        return Review.objects.filter(course_id=course_id).select_related('student').order_by('-created_at')
    
    def perform_create(self, serializer):
        course_id = self.kwargs.get('course_id')
        course = Course.objects.get(id=course_id)
        
        # Check if user is enrolled
        if not Enrollment.objects.filter(
            student=self.request.user,
            course=course,
            status__in=['active', 'completed']
        ).exists():
            raise serializers.ValidationError('You must be enrolled to review this course')
        
        review = serializer.save(course=course, student=self.request.user)
        
        # Update course rating
        avg_rating = Review.objects.filter(course=course).aggregate(Avg('rating'))['rating__avg']
        course.rating = round(avg_rating, 2) if avg_rating else 0
        course.total_ratings = Review.objects.filter(course=course).count()
        course.save()

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_courses(request):
    courses = Course.objects.filter(
        status='published',
        is_featured=True
    ).select_related('tutor', 'category')[:6]
    
    serializer = CourseListSerializer(courses, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def course_search(request):
    query = request.GET.get('q', '')
    category = request.GET.get('category', '')
    
    courses = Course.objects.filter(status='published')
    
    if query:
        courses = courses.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(short_description__icontains=query)
        )
    
    if category:
        courses = courses.filter(category__name__icontains=category)
    
    courses = courses.select_related('tutor', 'category')[:20]
    serializer = CourseListSerializer(courses, many=True, context={'request': request})
    return Response(serializer.data)

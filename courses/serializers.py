from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Course, Lesson, Enrollment, LessonProgress, Review

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class CourseDetailSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    tutor_name = serializers.CharField(source='tutor.get_full_name', read_only=True)
    tutor_avatar = serializers.ImageField(source='tutor.avatar', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    enrollment_count = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = '__all__'
    
    def get_enrollment_count(self, obj):
        return obj.enrollments.filter(status='active').count()
    
    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(
                student=request.user,
                course=obj,
                status='active'
            ).exists()
        return False

class CourseListSerializer(serializers.ModelSerializer):
    tutor_name = serializers.CharField(source='tutor.get_full_name', read_only=True)
    tutor_avatar = serializers.ImageField(source='tutor.avatar', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    enrollment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'short_description', 'thumbnail',
            'price', 'discount_price', 'difficulty', 'duration_weeks',
            'lessons_count', 'rating', 'total_ratings', 'is_featured',
            'tutor_name', 'tutor_avatar', 'category_name', 'enrollment_count',
            'created_at'
        ]
    
    def get_enrollment_count(self, obj):
        return obj.enrollments.filter(status='active').count()

class CourseCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        exclude = ['tutor', 'rating', 'total_ratings']
    
    def create(self, validated_data):
        validated_data['tutor'] = self.context['request'].user
        return super().create(validated_data)

class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_thumbnail = serializers.ImageField(source='course.thumbnail', read_only=True)
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = '__all__'
        read_only_fields = ['student', 'enrolled_at']

class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    lesson_type = serializers.CharField(source='lesson.lesson_type', read_only=True)
    
    class Meta:
        model = LessonProgress
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    student_avatar = serializers.ImageField(source='student.avatar', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['student']
    
    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)
from django.urls import path
from . import views

app_name = 'courses'

urlpatterns = [
    # Categories
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    
    # Courses - Public endpoints
    path('', views.CourseListView.as_view(), name='course_list'),
    path('featured/', views.featured_courses, name='featured_courses'),
    path('search/', views.course_search, name='course_search'),
    path('<slug:slug>/', views.CourseDetailView.as_view(), name='course_detail'),
    
    # Course management - Tutor endpoints
    path('tutor/my-courses/', views.TutorCoursesView.as_view(), name='tutor_courses'),
    path('tutor/create/', views.CourseCreateView.as_view(), name='course_create'),
    path('tutor/<int:pk>/update/', views.CourseUpdateView.as_view(), name='course_update'),
    path('tutor/<int:pk>/delete/', views.CourseDeleteView.as_view(), name='course_delete'),
    
    # Lessons
    path('<int:course_id>/lessons/', views.LessonListView.as_view(), name='lesson_list'),
    path('<int:course_id>/lessons/<int:pk>/', views.LessonDetailView.as_view(), name='lesson_detail'),
    path('<int:course_id>/lessons/create/', views.LessonCreateView.as_view(), name='lesson_create'),
    path('<int:course_id>/lessons/<int:pk>/update/', views.LessonUpdateView.as_view(), name='lesson_update'),
    
    # Student enrollment
    path('<int:course_id>/enroll/', views.enroll_course, name='enroll_course'),
    path('<int:course_id>/unenroll/', views.unenroll_course, name='unenroll_course'),
    path('student/enrollments/', views.StudentEnrollmentsView.as_view(), name='student_enrollments'),
    
    # Progress tracking
    path('lessons/<int:lesson_id>/complete/', views.mark_lesson_complete, name='mark_lesson_complete'),
    
    # Reviews
    path('<int:course_id>/reviews/', views.CourseReviewsView.as_view(), name='course_reviews'),
]
#!/usr/bin/env python
import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tutoring_platform.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import StudentProfile, TutorProfile

User = get_user_model()

def create_test_users():
    print("🎯 Creating test users for Naikoria Tech Academy...")
    
    # Create test students
    students_data = [
        {
            'email': 'student1@test.com',
            'username': 'student1',
            'first_name': 'Alice',
            'last_name': 'Johnson',
            'user_type': 'student',
            'grade_level': 'Grade 10',
            'school': 'Delhi Public School'
        },
        {
            'email': 'student2@test.com',
            'username': 'student2',
            'first_name': 'Bob',
            'last_name': 'Smith',
            'user_type': 'student',
            'grade_level': 'Grade 12',
            'school': 'St. Mary\'s High School'
        }
    ]
    
    for student_data in students_data:
        if not User.objects.filter(email=student_data['email']).exists():
            student = User.objects.create_user(
                email=student_data['email'],
                username=student_data['username'],
                first_name=student_data['first_name'],
                last_name=student_data['last_name'],
                user_type=student_data['user_type'],
                password='test123',
                is_verified=True
            )
            StudentProfile.objects.create(
                user=student,
                grade_level=student_data['grade_level'],
                school=student_data['school'],
                learning_goals='Improve math and science skills',
                preferred_subjects=['Mathematics', 'Science', 'Programming']
            )
            print(f"✅ Created student: {student.first_name} {student.last_name} ({student.email})")
    
    # Create test tutors
    tutors_data = [
        {
            'email': 'tutor1@test.com',
            'username': 'tutor1',
            'first_name': 'Dr. Sarah',
            'last_name': 'Wilson',
            'user_type': 'tutor',
            'title': 'Mathematics Professor',
            'specialization': ['Mathematics', 'Physics'],
            'qualifications': 'phd',
            'experience_years': 8,
            'hourly_rate': 1500.00
        },
        {
            'email': 'tutor2@test.com',
            'username': 'tutor2',
            'first_name': 'John',
            'last_name': 'Davis',
            'user_type': 'tutor',
            'title': 'Programming Expert',
            'specialization': ['Python', 'JavaScript', 'Web Development'],
            'qualifications': 'master',
            'experience_years': 5,
            'hourly_rate': 2000.00
        }
    ]
    
    for tutor_data in tutors_data:
        if not User.objects.filter(email=tutor_data['email']).exists():
            tutor = User.objects.create_user(
                email=tutor_data['email'],
                username=tutor_data['username'],
                first_name=tutor_data['first_name'],
                last_name=tutor_data['last_name'],
                user_type=tutor_data['user_type'],
                password='test123',
                is_verified=True
            )
            TutorProfile.objects.create(
                user=tutor,
                title=tutor_data['title'],
                specialization=tutor_data['specialization'],
                qualifications=tutor_data['qualifications'],
                experience_years=tutor_data['experience_years'],
                hourly_rate=tutor_data['hourly_rate'],
                languages_spoken=['English', 'Hindi'],
                is_available=True,
                rating=4.8,
                total_reviews=25
            )
            print(f"✅ Created tutor: {tutor.first_name} {tutor.last_name} ({tutor.email})")
    
    print(f"\n🎉 Test users created successfully!")
    print(f"📧 All users have password: test123")
    print(f"🎓 Students: student1@test.com, student2@test.com")
    print(f"👨‍🏫 Tutors: tutor1@test.com, tutor2@test.com")

if __name__ == "__main__":
    create_test_users()
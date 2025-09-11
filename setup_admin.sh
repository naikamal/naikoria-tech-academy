#!/bin/bash

# Setup admin user for Naikoria Tech Academy

echo "Setting up admin user for Naikoria Tech Academy..."

# Wait for Django to be ready
echo "Waiting for Django service to be ready..."
sleep 10

# Run Django migrations
echo "Running database migrations..."
docker-compose exec django python manage.py migrate

# Create superuser
echo "Creating admin superuser..."
docker-compose exec django python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@naikoria.com',
        password='admin123',
        first_name='Admin',
        last_name='User',
        user_type='admin'
    )
    print("Admin user created successfully!")
    print("Username: admin")
    print("Password: admin123") 
    print("Email: admin@naikoria.com")
else:
    print("Admin user already exists")
EOF

# Create sample categories
echo "Creating sample course categories..."
docker-compose exec django python manage.py shell << EOF
from courses.models import Category

categories = [
    {'name': 'Programming', 'description': 'Software development and coding', 'icon': 'code'},
    {'name': 'Mathematics', 'description': 'Math concepts and problem solving', 'icon': 'calculator'},
    {'name': 'Science', 'description': 'Physics, Chemistry, Biology', 'icon': 'flask'},
    {'name': 'Languages', 'description': 'Language learning and literature', 'icon': 'globe'},
    {'name': 'Business', 'description': 'Business and entrepreneurship', 'icon': 'briefcase'},
    {'name': 'Design', 'description': 'UI/UX and graphic design', 'icon': 'palette'},
]

for cat_data in categories:
    Category.objects.get_or_create(
        name=cat_data['name'],
        defaults=cat_data
    )

print("Sample categories created!")
EOF

echo ""
echo "Setup complete!"
echo "Visit http://localhost/admin/ to access the admin panel"
echo "Username: admin"
echo "Password: admin123"
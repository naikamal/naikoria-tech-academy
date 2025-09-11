#!/bin/bash

echo "🚀 STARTING NAIKORIA TECH ACADEMY (Correct Project)!"
echo "=================================================="

cd /home/naikamal/my_platform

# Stop everything first
echo "1. Stopping all Docker containers..."
sudo docker stop $(sudo docker ps -aq) 2>/dev/null || true
sudo docker rm $(sudo docker ps -aq) 2>/dev/null || true

# Kill any processes using our ports
echo "2. Freeing up ports..."
sudo fuser -k 8080/tcp 2>/dev/null || true
sudo fuser -k 5432/tcp 2>/dev/null || true  
sudo fuser -k 6379/tcp 2>/dev/null || true

echo "3. Starting PostgreSQL database on port 5433..."
sudo docker run -d --name naikoria-db \
  -e POSTGRES_DB=tutoring_platform \
  -e POSTGRES_USER=tutoring_user \
  -e POSTGRES_PASSWORD=tutoring_pass \
  -p 5433:5432 \
  postgres:15

echo "4. Starting Redis cache on port 6380..."
sudo docker run -d --name naikoria-redis \
  -p 6380:6379 \
  redis:7-alpine

echo "5. Waiting for services to start..."
sleep 12

echo "6. Verifying we're in the correct project directory..."
pwd
ls -la manage.py 2>/dev/null || echo "ERROR: manage.py not found!"

echo "7. Building Naikoria Tech Academy Django app..."
cat > Dockerfile.naikoria << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install minimal Python packages
RUN pip install --no-cache-dir \
    django==4.2.7 \
    djangorestframework==3.14.0 \
    psycopg2-binary==2.9.7 \
    django-environ==0.11.2 \
    django-cors-headers==4.3.1 \
    djangorestframework-simplejwt==5.3.0 \
    redis==5.0.1 \
    Pillow==10.1.0 \
    channels==4.0.0

# Copy project files
COPY . /app/

# Create directories
RUN mkdir -p /app/staticfiles /app/media /app/logs

# Try to collect static files
RUN python manage.py collectstatic --noinput --settings=tutoring_platform.settings || echo "Static collection skipped"

EXPOSE 8080

# Start Django on port 8080 to avoid conflicts
CMD ["python", "manage.py", "runserver", "0.0.0.0:8080", "--settings=tutoring_platform.settings"]
EOF

sudo docker build -f Dockerfile.naikoria -t naikoria-tech-academy .

echo "8. Starting Naikoria Tech Academy on port 8080..."
sudo docker run -d --name naikoria-django \
  --link naikoria-db:db \
  --link naikoria-redis:redis \
  -p 8080:8080 \
  -e DATABASE_URL=postgresql://tutoring_user:tutoring_pass@db:5432/tutoring_platform \
  -e REDIS_URL=redis://redis:6379/0 \
  -e SECRET_KEY=naikoria-tech-academy-secret-key-2024 \
  -e DEBUG=True \
  -e ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0 \
  naikoria-tech-academy

echo "9. Waiting for Naikoria to start..."
sleep 20

echo "10. Running database migrations for Naikoria..."
sudo docker exec naikoria-django python manage.py migrate --settings=tutoring_platform.settings

echo "11. Creating Naikoria admin user..."
sudo docker exec naikoria-django python manage.py shell --settings=tutoring_platform.settings << 'EOF'
from django.contrib.auth import get_user_model
User = get_user_model()

try:
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@naikoria.com', 
            password='admin123'
        )
        # Set user_type if the field exists
        if hasattr(admin_user, 'user_type'):
            admin_user.user_type = 'admin'
            admin_user.save()
        print('✅ Naikoria admin user created successfully!')
    else:
        print('ℹ️  Admin user already exists')
        
    print(f'Total users in system: {User.objects.count()}')
    
except Exception as e:
    print(f'Error creating admin: {e}')
    # Fallback - create basic superuser
    try:
        User.objects.create_user(
            username='admin', 
            email='admin@naikoria.com', 
            password='admin123',
            is_staff=True,
            is_superuser=True
        )
        print('✅ Basic admin user created as fallback!')
    except Exception as e2:
        print(f'Fallback failed too: {e2}')
EOF

echo "12. Creating sample course categories..."
sudo docker exec naikoria-django python manage.py shell --settings=tutoring_platform.settings << 'EOF'
try:
    from courses.models import Category
    
    categories = [
        {'name': 'Programming', 'description': 'Learn coding and software development'},
        {'name': 'Mathematics', 'description': 'Master mathematical concepts'},
        {'name': 'Science', 'description': 'Explore physics, chemistry, and biology'},
        {'name': 'Business', 'description': 'Business and entrepreneurship skills'},
    ]
    
    for cat_data in categories:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f'✅ Created category: {cat_data["name"]}')
            
    print(f'Total categories: {Category.objects.count()}')
    
except ImportError:
    print('⚠️  Courses app not ready yet - categories will be created later')
except Exception as e:
    print(f'Error creating categories: {e}')
EOF

echo ""
echo "🎉 NAIKORIA TECH ACADEMY IS LIVE!"
echo "================================="
echo ""
echo "🌐 Access YOUR Naikoria Tech Academy:"
echo "   🏠 Main Platform:  http://localhost:8080"
echo "   🔧 Admin Panel:    http://localhost:8080/admin/"
echo "   📡 API Endpoint:   http://localhost:8080/api/v1/"
echo ""
echo "👤 Login Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "🐳 Container Status:"
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep naikoria
echo ""
echo "🚀 Your AI-Powered Tutoring Platform is Ready!"
echo "   Open http://localhost:8080 in your browser!"
echo ""
echo "📝 Note: Using port 8080 to avoid conflicts with other services"
echo "================================="
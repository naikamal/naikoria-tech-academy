#!/bin/bash

# Simple Naikoria Startup - No complex error handling
echo "🚀 Starting Naikoria Tech Academy..."

cd /home/naikamal/my_platform

# Force stop everything first
sudo docker stop $(sudo docker ps -aq) 2>/dev/null || true
sudo docker rm $(sudo docker ps -aq) 2>/dev/null || true

# Start just the essential services
echo "Starting database..."
sudo docker run -d --name naikoria-db \
  -e POSTGRES_DB=tutoring_platform \
  -e POSTGRES_USER=tutoring_user \
  -e POSTGRES_PASSWORD=tutoring_pass \
  -p 5432:5432 \
  postgres:15

echo "Starting Redis..."
sudo docker run -d --name naikoria-redis \
  -p 6379:6379 \
  redis:7-alpine

echo "Waiting for services..."
sleep 10

# Create a minimal Django container
echo "Building Django service..."
sudo docker build -f Dockerfile.django -t naikoria-django .

echo "Starting Django..."
sudo docker run -d --name naikoria-django \
  --link naikoria-db:db \
  --link naikoria-redis:redis \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://tutoring_user:tutoring_pass@db:5432/tutoring_platform \
  -e REDIS_URL=redis://redis:6379/0 \
  -e DEBUG=True \
  naikoria-django

echo "Waiting for Django to start..."
sleep 15

# Run migrations
echo "Running migrations..."
sudo docker exec naikoria-django python manage.py migrate

# Create admin user
echo "Creating admin user..."
sudo docker exec naikoria-django python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@naikoria.com', 'admin123')
    print('Admin created: admin/admin123')
"

# Simple nginx proxy
echo "Starting simple web proxy..."
sudo docker run -d --name naikoria-nginx \
  --link naikoria-django:django \
  -p 80:80 \
  -v /home/naikamal/my_platform/simple_nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx:alpine

echo ""
echo "🎉 NAIKORIA TECH ACADEMY IS RUNNING!"
echo "=================================="
echo "🌐 Website: http://localhost"
echo "🔧 Admin: http://localhost/admin (admin/admin123)"
echo "📡 Django API: http://localhost:8000"
echo ""
echo "Container Status:"
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
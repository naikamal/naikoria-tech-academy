#!/bin/bash

echo "🚀 STARTING NAIKORIA TECH ACADEMY NOW!"
echo "====================================="

cd /home/naikamal/my_platform

# Clean slate
sudo docker stop $(sudo docker ps -aq) 2>/dev/null || true
sudo docker rm $(sudo docker ps -aq) 2>/dev/null || true

echo "1. Starting PostgreSQL database..."
sudo docker run -d --name db \
  -e POSTGRES_DB=tutoring_platform \
  -e POSTGRES_USER=tutoring_user \
  -e POSTGRES_PASSWORD=tutoring_pass \
  -p 5432:5432 \
  postgres:15

echo "2. Starting Redis cache..."
sudo docker run -d --name redis \
  -p 6379:6379 \
  redis:7-alpine

echo "3. Waiting 10 seconds for services..."
sleep 10

echo "4. Building minimal Django app..."
sudo docker build -f Dockerfile.simple -t naikoria-app .

echo "5. Starting Django app..."
sudo docker run -d --name django \
  --link db:db \
  --link redis:redis \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://tutoring_user:tutoring_pass@db:5432/tutoring_platform \
  -e REDIS_URL=redis://redis:6379/0 \
  -e SECRET_KEY=naikoria-simple-key \
  -e DEBUG=True \
  -e ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0 \
  naikoria-app

echo "6. Waiting for Django to start..."
sleep 15

echo "7. Running database setup..."
sudo docker exec django python manage.py migrate --run-syncdb

echo "8. Creating admin user..."
sudo docker exec django python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
try:
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@naikoria.com', 'admin123')
        print('✅ Admin user created!')
    else:
        print('ℹ️  Admin user already exists')
except Exception as e:
    print('Creating basic admin user...')
    User.objects.create_user('admin', 'admin@naikoria.com', 'admin123', is_staff=True, is_superuser=True)
"

echo ""
echo "🎉 NAIKORIA TECH ACADEMY IS LIVE!"
echo "================================="
echo ""
echo "🌐 Access your platform:"
echo "   Main site:  http://localhost:8000"
echo "   Admin panel: http://localhost:8000/admin/"
echo ""
echo "👤 Login credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "📊 Container status:"
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "🚀 Your AI-powered tutoring platform is ready!"
echo "   Open http://localhost:8000 in your browser!"
echo "================================="
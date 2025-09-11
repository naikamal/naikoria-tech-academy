#!/bin/bash

# Naikoria Tech Academy - Fully Automated Start
# No user input required

set -e

echo "🚀 Starting Naikoria Tech Academy (Automated)..."

cd /home/naikamal/my_platform

# Clean up everything
echo "1. Cleaning up..."
sudo docker stop $(sudo docker ps -aq) 2>/dev/null || true
sudo docker rm $(sudo docker ps -aq) 2>/dev/null || true

# Start database
echo "2. Starting database..."
sudo docker run -d --name naikoria-db \
  -e POSTGRES_DB=tutoring_platform \
  -e POSTGRES_USER=tutoring_user \
  -e POSTGRES_PASSWORD=tutoring_pass \
  -p 5433:5432 \
  postgres:15

# Start Redis
echo "3. Starting Redis..."
sudo docker run -d --name naikoria-redis \
  -p 6380:6379 \
  redis:7-alpine

# Wait
echo "4. Waiting for services..."
sleep 12

# Create simple Dockerfile
echo "5. Creating Dockerfile..."
cat > /tmp/Dockerfile.simple << 'EOF'
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=tutoring_platform.settings

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    django==4.2.7 \
    psycopg2-binary==2.9.7 \
    django-environ==0.11.2

COPY . /app/

EXPOSE 8080

CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]
EOF

# Build image
echo "6. Building Naikoria image..."
sudo docker build -f /tmp/Dockerfile.simple -t naikoria-simple .

# Start Django
echo "7. Starting Django..."
sudo docker run -d --name naikoria-django \
  --link naikoria-db:db \
  --link naikoria-redis:redis \
  -p 8080:8080 \
  -e DATABASE_URL=postgresql://tutoring_user:tutoring_pass@db:5432/tutoring_platform \
  -e SECRET_KEY=naikoria-simple-key-12345 \
  -e DEBUG=True \
  -e ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0 \
  naikoria-simple

# Wait for Django
echo "8. Waiting for Django to start..."
sleep 20

# Test if Django is responding
echo "9. Testing Django..."
for i in {1..10}; do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200\|404\|500"; then
        echo "✅ Django is responding!"
        break
    fi
    echo "   Waiting for Django... ($i/10)"
    sleep 3
done

# Show status
echo ""
echo "🎉 NAIKORIA TECH ACADEMY STATUS:"
echo "================================="
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "🌐 Access your platform:"
echo "   Main site: http://localhost:8080"
echo ""
echo "📊 Test the connection:"
curl -I http://localhost:8080 2>/dev/null || echo "Connection test failed"
echo ""
echo "✅ Platform should be accessible now!"
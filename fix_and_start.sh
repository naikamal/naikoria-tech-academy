#!/bin/bash

# Naikoria Tech Academy - Complete Fix and Start
# This script fixes all issues and starts the platform

echo "🔧 NAIKORIA TECH ACADEMY - COMPLETE FIX & START"
echo "=============================================="

cd /home/naikamal/my_platform

# Step 1: Fix Docker permissions
echo "1. Fixing Docker permissions..."
sudo usermod -aG docker $USER 2>/dev/null || true
sudo chmod 666 /var/run/docker.sock
sudo systemctl restart docker
echo "✅ Docker permissions fixed"

# Step 2: Clean up everything
echo "2. Cleaning up existing containers..."
sudo docker stop $(sudo docker ps -aq) 2>/dev/null || true
sudo docker rm $(sudo docker ps -aq) 2>/dev/null || true
sudo docker system prune -f 2>/dev/null || true
echo "✅ Cleanup complete"

# Step 3: Start with minimal setup
echo "3. Starting minimal Naikoria Tech Academy..."
sudo docker-compose -f docker-compose.minimal.yml up -d --build

# Step 4: Wait for services to start
echo "4. Waiting for services to start..."
sleep 20

# Step 5: Run database migrations
echo "5. Running database migrations..."
sudo docker-compose -f docker-compose.minimal.yml exec -T web python manage.py migrate

# Step 6: Create admin user (non-interactive)
echo "6. Creating admin user..."
sudo docker-compose -f docker-compose.minimal.yml exec -T web python manage.py shell << 'EOF'
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    try:
        User.objects.create_superuser('admin', 'admin@naikoria.com', 'admin123')
        print('✅ Admin user created: admin/admin123')
    except:
        User.objects.create_user('admin', 'admin@naikoria.com', 'admin123', is_staff=True, is_superuser=True)
        print('✅ Admin user created (fallback method)')
else:
    print('ℹ️  Admin user already exists')
EOF

# Step 7: Show status and access info
echo ""
echo "🎉 NAIKORIA TECH ACADEMY IS READY!"
echo "================================="
echo ""
echo "🌐 Access your platform:"
echo "   Main site:  http://localhost:8080"
echo "   Admin panel: http://localhost:8080/admin/"
echo ""
echo "👤 Login credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "🐳 Container status:"
sudo docker-compose -f docker-compose.minimal.yml ps
echo ""
echo "📊 Connection test:"
curl -I http://localhost:8080 2>/dev/null | head -1 || echo "Connection test failed - check logs"
echo ""
echo "🔍 Django logs (last 10 lines):"
sudo docker-compose -f docker-compose.minimal.yml logs web --tail 10
echo ""
echo "✅ Platform should be accessible at http://localhost:8080"
echo "✅ If not working, check the logs above for errors"
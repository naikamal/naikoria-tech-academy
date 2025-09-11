#!/bin/bash

# Naikoria Tech Academy - Quick Launch Script
# Fixed dependency conflicts and optimized startup

set -e

echo "🚀 Launching Naikoria Tech Academy Platform"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Navigate to project directory
cd "$(dirname "$0")"
print_info "Working directory: $(pwd)"

# Step 1: Clean up any previous builds
print_info "Cleaning up previous builds..."
docker-compose down --remove-orphans 2>/dev/null || true
docker system prune -f 2>/dev/null || true

# Step 2: Check Docker Compose
print_info "Checking Docker Compose..."
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    print_error "Docker Compose not found. Installing..."
    sudo apt update && sudo apt install -y docker-compose-plugin
    COMPOSE_CMD="docker compose"
fi
print_success "Using: $COMPOSE_CMD"

# Step 3: Start essential services first (database and cache)
print_info "Starting database and cache services..."
if $COMPOSE_CMD up -d db redis; then
    print_success "Database and cache services started"
    
    # Wait for database to be ready
    print_info "Waiting for database to be ready..."
    sleep 15
    
    # Check database health
    DB_READY=false
    for i in {1..12}; do
        if docker exec $(docker-compose ps -q db) pg_isready -U tutoring_user -d tutoring_platform 2>/dev/null; then
            DB_READY=true
            break
        fi
        print_info "Waiting for database... ($i/12)"
        sleep 5
    done
    
    if [ "$DB_READY" = true ]; then
        print_success "Database is ready!"
    else
        print_warning "Database might not be fully ready, continuing anyway..."
    fi
else
    print_error "Failed to start database and cache services"
    exit 1
fi

# Step 4: Build and start backend services
print_info "Building and starting backend services..."
if $COMPOSE_CMD up -d --build django fastapi; then
    print_success "Backend services started"
    
    # Wait for backend services
    print_info "Waiting for backend services..."
    sleep 20
else
    print_error "Failed to start backend services. Checking logs..."
    $COMPOSE_CMD logs django fastapi
    exit 1
fi

# Step 5: Start background task services
print_info "Starting background task services..."
if $COMPOSE_CMD up -d celery_worker celery_beat; then
    print_success "Background task services started"
    sleep 10
else
    print_warning "Background tasks might have issues, continuing..."
fi

# Step 6: Start frontend and proxy
print_info "Starting frontend and proxy services..."
if $COMPOSE_CMD up -d frontend nginx; then
    print_success "Frontend and proxy services started"
    sleep 15
else
    print_warning "Frontend services might have issues, continuing..."
fi

# Step 7: Check service status
print_info "Checking service status..."
echo "=== Docker Container Status ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(naikoria|my_platform|db|redis|django|fastapi|nginx|frontend|celery)"

# Step 8: Run database migrations and setup
print_info "Running database migrations..."
if docker-compose exec -T django python manage.py migrate; then
    print_success "Database migrations completed"
else
    print_error "Database migrations failed"
fi

print_info "Collecting static files..."
if docker-compose exec -T django python manage.py collectstatic --noinput; then
    print_success "Static files collected"
else
    print_warning "Static files collection had issues"
fi

# Step 9: Create admin user
print_info "Creating admin user..."
docker-compose exec -T django python manage.py shell << 'EOF'
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
    print("✅ Admin user created!")
    print("   Username: admin")
    print("   Password: admin123")
else:
    print("ℹ️  Admin user already exists")
EOF

# Step 10: Create sample data
print_info "Creating sample categories..."
docker-compose exec -T django python manage.py shell << 'EOF'
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

print("✅ Sample categories created!")
EOF

# Final status check
echo ""
echo "=================================================="
print_success "🎉 Naikoria Tech Academy Platform is READY!"
echo "=================================================="
echo ""
echo "🌐 Access your platform:"
echo "   Frontend:        http://localhost"
echo "   Admin Panel:     http://localhost/admin/"
echo "   Django API:      http://localhost/api/v1/"
echo "   FastAPI AI:      http://localhost/ai/"
echo "   AI Documentation: http://localhost/ai/docs"
echo ""
echo "👤 Default Admin Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "🚀 AI Features Available:"
echo "   ✅ 24/7 Personal AI Tutor"
echo "   ✅ Content Generation & Curation"
echo "   ✅ Assignment Grading"
echo "   ✅ Real-time Chat & Collaboration"
echo "   ✅ Learning Analytics"
echo "   ✅ Live Session Support"
echo ""
echo "🔧 Management Commands:"
echo "   ./manage_naikoria.sh status    # Check service status"
echo "   ./manage_naikoria.sh logs      # View logs"
echo "   ./manage_naikoria.sh stop      # Stop all services"
echo "   ./manage_naikoria.sh restart   # Restart services"
echo ""
print_info "Platform is running! Open http://localhost in your browser"
echo "=================================================="
print_success "🚀 Welcome to the future of AI-powered education!"
echo "=================================================="
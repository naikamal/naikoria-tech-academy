#!/bin/bash

# Naikoria Tech Academy - Startup Script
# Starts all services for the AI-powered tutoring platform

echo "Starting Naikoria Tech Academy Platform..."
echo "==================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[OK] $1${NC}"
}

print_info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

print_error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install it first."
    exit 1
fi

print_info "Building and starting services..."

# Build and start all services
docker-compose up -d --build

# Wait a moment for services to start
sleep 5

print_info "Checking service status..."

# Check each service
services=("db" "redis" "django" "fastapi" "celery_worker" "celery_beat" "frontend" "nginx")

for service in "${services[@]}"; do
    if docker-compose ps $service | grep -q "Up"; then
        print_status "$service is running"
    else
        print_warning "$service might not be ready yet"
    fi
done

echo ""
echo "Naikoria Tech Academy is starting up!"
echo "==================================================="
echo ""
echo "Frontend URL:     http://localhost"
echo "Django Admin:     http://localhost/admin/"
echo "Django API:       http://localhost/api/v1/"
echo "FastAPI AI:       http://localhost/ai/"
echo "AI API Docs:      http://localhost/ai/docs"
echo "WebSocket:        ws://localhost/ws/"
echo ""
echo "Default Admin:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "AI Features Available:"
echo "   - Personal AI Tutor"
echo "   - Content Curator"
echo "   - Assignment Grader"
echo "   - Real-time Chat"
echo "   - Live Sessions"
echo ""

print_info "Run 'docker-compose logs -f' to see all service logs"
print_info "Run 'docker-compose down' to stop all services"
print_info "Run './setup_admin.sh' to create admin user"

echo ""
print_status "Naikoria Tech Academy is ready!"
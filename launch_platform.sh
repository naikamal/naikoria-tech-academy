#!/bin/bash

# Naikoria Tech Academy - Complete Launch Script
# This script will handle everything automatically

set -e  # Exit on any error

echo "=================================================="
echo "🚀 Launching Naikoria Tech Academy Platform"
echo "=================================================="

# Check if running as root for Docker permissions
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  Running with user permissions, may need sudo for Docker commands"
fi

# Function to print colored output
print_success() {
    echo -e "\e[32m✅ $1\e[0m"
}

print_info() {
    echo -e "\e[34mℹ️  $1\e[0m"
}

print_error() {
    echo -e "\e[31m❌ $1\e[0m"
}

# Step 1: Check Docker installation
print_info "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_error "Docker not found. Installing Docker..."
    sudo apt update
    sudo apt install -y docker.io docker-compose-plugin
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
fi
print_success "Docker is available"

# Step 2: Check Docker Compose
print_info "Checking Docker Compose..."
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    print_info "Installing Docker Compose..."
    sudo apt update
    sudo apt install -y docker-compose-plugin
    COMPOSE_CMD="docker compose"
fi
print_success "Docker Compose is available: $COMPOSE_CMD"

# Step 3: Navigate to project directory
cd "$(dirname "$0")"
print_info "Working in: $(pwd)"

# Step 4: Stop any existing containers
print_info "Stopping any existing containers..."
$COMPOSE_CMD down --remove-orphans 2>/dev/null || true

# Step 5: Build and start all services
print_info "Building and starting all services..."
print_info "This may take several minutes for the first run..."

if $COMPOSE_CMD up -d --build; then
    print_success "All services started successfully!"
else
    print_error "Failed to start services. Trying with sudo..."
    if sudo $COMPOSE_CMD up -d --build; then
        print_success "Services started with sudo!"
    else
        print_error "Failed to start services even with sudo. Check logs below:"
        sudo $COMPOSE_CMD logs
        exit 1
    fi
fi

# Step 6: Wait for services to be ready
print_info "Waiting for services to be ready..."
sleep 30

# Step 7: Check service status
print_info "Checking service status..."
if sudo $COMPOSE_CMD ps; then
    print_success "Service status check completed"
else
    print_error "Could not check service status"
fi

# Step 8: Setup admin user and sample data
print_info "Setting up admin user and sample data..."
if [ -f "./setup_admin.sh" ]; then
    chmod +x ./setup_admin.sh
    if ./setup_admin.sh; then
        print_success "Admin setup completed!"
    else
        print_info "Admin setup failed, trying manual setup..."
        # Manual admin setup
        sudo docker-compose exec django python manage.py migrate
        sudo docker-compose exec django python manage.py collectstatic --noinput
        sudo docker-compose exec django python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@naikoria.com', 'admin123')
    print('Admin user created!')
else:
    print('Admin user already exists')
"
    fi
else
    print_error "setup_admin.sh not found"
fi

# Step 9: Final status check
print_info "Final system status:"
echo "Docker containers:"
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

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
echo "🚀 Features Available:"
echo "   ✅ AI Personal Tutor"
echo "   ✅ Live Interactive Sessions"
echo "   ✅ Course Management"
echo "   ✅ Real-time Chat"
echo "   ✅ Assignment Grading"
echo "   ✅ Analytics Dashboard"
echo ""
print_info "Platform is running! Open http://localhost in your browser"

# Step 10: Optional - Open browser automatically
if command -v xdg-open &> /dev/null; then
    read -p "🌐 Open http://localhost in browser automatically? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        xdg-open http://localhost
    fi
fi

echo "=================================================="
print_success "Launch completed! Enjoy your Naikoria Tech Academy!"
echo "=================================================="
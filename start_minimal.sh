#!/bin/bash

echo "=== Naikoria Tech Academy - Minimal Startup Script ==="
echo "Starting minimal Django platform on http://localhost:8080"

# Navigate to project directory
cd /home/naikamal/my_platform

# Clean up any existing containers
echo "Cleaning up existing containers..."
docker-compose -f docker-compose.minimal.yml down --volumes --remove-orphans 2>/dev/null || true

# Check if Docker is working
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker permission issue detected!"
    echo "Please run: ./fix_docker_permissions.sh"
    echo "Or manually fix with: sudo chmod 666 /var/run/docker.sock"
    exit 1
fi

# Build and start minimal services
echo "Building minimal Django container..."
docker-compose -f docker-compose.minimal.yml build --no-cache django

echo "Starting minimal services (PostgreSQL + Django)..."
docker-compose -f docker-compose.minimal.yml up -d db

# Wait for database to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 10

# Run migrations
echo "Running database migrations..."
docker-compose -f docker-compose.minimal.yml run --rm django python manage.py migrate

# Start Django service
echo "Starting Django service..."
docker-compose -f docker-compose.minimal.yml up django

echo "=== Platform should be available at http://localhost:8080 ==="
echo "Press Ctrl+C to stop the services"
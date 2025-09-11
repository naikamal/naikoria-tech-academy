#!/bin/bash

echo "=== Naikoria Tech Academy - Local Development Startup ==="
echo "Running Django locally (without Docker)"

# Navigate to project directory
cd /home/naikamal/my_platform

# Check if Python virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install minimal requirements
echo "Installing minimal Python dependencies..."
pip install -r requirements.minimal.txt

# Start PostgreSQL in Docker (only database)
echo "Starting PostgreSQL database in Docker..."
docker run -d --name naikoria_db_local \
    -e POSTGRES_DB=tutoring_platform \
    -e POSTGRES_USER=tutoring_user \
    -e POSTGRES_PASSWORD=tutoring_pass \
    -p 5432:5432 \
    postgres:15

# Wait for database
echo "Waiting for database to start..."
sleep 5

# Update database settings for local connection
export DATABASE_URL="postgresql://tutoring_user:tutoring_pass@localhost:5432/tutoring_platform"
export DJANGO_SETTINGS_MODULE="settings_minimal"

# Run migrations
echo "Running database migrations..."
python manage.py migrate --settings=settings_minimal

# Create superuser (optional)
echo "Creating superuser (optional - you can skip this)..."
echo "Username: admin, Password: admin123"
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@naikoria.com', 'admin123') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell --settings=settings_minimal

# Start Django development server
echo "Starting Django development server on http://localhost:8080..."
python manage.py runserver 0.0.0.0:8080 --settings=settings_minimal
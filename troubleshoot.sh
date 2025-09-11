#!/bin/bash

echo "=== Naikoria Tech Academy - Troubleshooting Script ==="

cd /home/naikamal/my_platform

echo "1. Checking Docker status..."
if command -v docker &> /dev/null; then
    echo "✓ Docker is installed"
    if docker ps &> /dev/null; then
        echo "✓ Docker is accessible"
        echo "Running containers:"
        docker ps
        echo ""
        echo "All containers (including stopped):"
        docker ps -a
    else
        echo "❌ Docker permission issue or daemon not running"
        echo "Try: sudo chmod 666 /var/run/docker.sock"
        echo "Or: sudo systemctl start docker"
    fi
else
    echo "❌ Docker is not installed"
fi

echo ""
echo "2. Checking port 8080..."
if lsof -i :8080 &> /dev/null; then
    echo "❌ Port 8080 is already in use:"
    lsof -i :8080
else
    echo "✓ Port 8080 is available"
fi

echo ""
echo "3. Checking port 8000..."
if lsof -i :8000 &> /dev/null; then
    echo "❌ Port 8000 is already in use:"
    lsof -i :8000
else
    echo "✓ Port 8000 is available"
fi

echo ""
echo "4. Checking port 5432 (PostgreSQL)..."
if lsof -i :5432 &> /dev/null; then
    echo "ℹ️ Port 5432 is in use (probably PostgreSQL):"
    lsof -i :5432
else
    echo "✓ Port 5432 is available"
fi

echo ""
echo "5. Checking Python environment..."
if command -v python3 &> /dev/null; then
    echo "✓ Python3 is installed: $(python3 --version)"
    if [ -d "venv" ]; then
        echo "✓ Virtual environment exists"
    else
        echo "ℹ️ No virtual environment found"
    fi
else
    echo "❌ Python3 is not installed"
fi

echo ""
echo "6. Checking project structure..."
required_files=("manage.py" "tutoring_platform/settings.py" "requirements.txt")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "❌ $file is missing"
    fi
done

echo ""
echo "7. Docker logs (if containers exist)..."
if docker ps -a --format "table {{.Names}}" | grep -q "django\|db"; then
    echo "Django container logs:"
    docker logs $(docker ps -a --filter "name=django" --format "{{.ID}}" | head -1) --tail 10 2>/dev/null || echo "No Django container logs"
    echo ""
    echo "Database container logs:"
    docker logs $(docker ps -a --filter "name=db" --format "{{.ID}}" | head -1) --tail 10 2>/dev/null || echo "No database container logs"
fi

echo ""
echo "=== Troubleshooting complete ==="
echo ""
echo "RECOMMENDED SOLUTIONS:"
echo "1. For Docker issues: Run ./fix_docker_permissions.sh"
echo "2. For minimal Docker setup: Run ./start_minimal.sh"
echo "3. For local development: Run ./start_local.sh"
echo "4. Check Django logs: docker-compose -f docker-compose.minimal.yml logs django"
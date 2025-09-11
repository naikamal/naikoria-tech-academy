#!/bin/bash

echo "=== Naikoria Tech Academy - Docker Permission Fix ==="
echo "Attempting to fix Docker daemon socket permissions..."

# Check if user is in docker group
if groups $USER | grep -q '\bdocker\b'; then
    echo "✓ User is already in docker group"
else
    echo "✗ User not in docker group. Adding user to docker group..."
    sudo usermod -aG docker $USER
    echo "✓ Added user to docker group. You may need to logout and login again."
fi

# Check Docker daemon status
echo "Checking Docker daemon status..."
if systemctl is-active --quiet docker; then
    echo "✓ Docker daemon is running"
else
    echo "✗ Docker daemon is not running. Starting Docker..."
    sudo systemctl start docker
    sudo systemctl enable docker
fi

# Fix socket permissions
echo "Fixing Docker socket permissions..."
sudo chmod 666 /var/run/docker.sock

# Test Docker access
echo "Testing Docker access..."
if docker ps > /dev/null 2>&1; then
    echo "✓ Docker is working correctly!"
else
    echo "✗ Docker still has issues. Try running 'newgrp docker' or logout/login."
    echo "If issues persist, run: sudo chmod 666 /var/run/docker.sock"
fi

echo "=== Permission fix complete ==="
#!/bin/bash

# Online Tutoring Platform - Development Environment Setup Script
# For Ubuntu 20.04/22.04

set -e

echo "🚀 Setting up Online Tutoring Platform Development Environment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Python 3.11 and pip
echo "🐍 Installing Python 3.11..."
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip

# Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Redis
echo "🔴 Installing Redis..."
sudo apt install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Install Node.js and npm
echo "📗 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install system dependencies for Python packages
echo "🔧 Installing system dependencies..."
sudo apt install -y build-essential libpq-dev libffi-dev libjpeg-dev zlib1g-dev

# Create Python virtual environment
echo "🔧 Creating Python virtual environment..."
python3.11 -m venv venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Create PostgreSQL database and user
echo "🗄️ Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE USER tutoring_user WITH PASSWORD 'tutoring_pass';"
sudo -u postgres psql -c "CREATE DATABASE tutoring_platform OWNER tutoring_user;"
sudo -u postgres psql -c "ALTER USER tutoring_user CREATEDB;"

echo "✅ Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Install Python dependencies: pip install -r requirements.txt"
echo "3. Install Node.js dependencies: npm install"
echo ""
echo "Database connection details:"
echo "  Host: localhost"
echo "  Database: tutoring_platform"
echo "  User: tutoring_user"
echo "  Password: tutoring_pass"
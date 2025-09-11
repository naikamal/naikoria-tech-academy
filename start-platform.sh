#!/bin/bash

echo "Starting Naikora Platform..."

# Copy docker env file
cp .env.docker .env

# Start the containers
docker-compose -f docker-compose.minimal.yml down
docker-compose -f docker-compose.minimal.yml build web
docker-compose -f docker-compose.minimal.yml up -d

echo "Containers started. Waiting for database to be ready..."
sleep 10

# Run migrations
docker-compose -f docker-compose.minimal.yml exec web python manage.py migrate --noinput

echo "Platform should be available at http://localhost:8080"
echo "Checking status..."
docker-compose -f docker-compose.minimal.yml ps
#!/bin/bash

# Naikoria Tech Academy - Management Script
# Complete platform management commands

show_help() {
    echo "Naikoria Tech Academy - Management Commands"
    echo "============================================="
    echo ""
    echo "Usage: ./manage_naikoria.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start          Start all services"
    echo "  stop           Stop all services"
    echo "  restart        Restart all services"
    echo "  status         Show service status"
    echo "  logs           Show service logs"
    echo "  setup          Setup admin and sample data"
    echo "  migrate        Run database migrations"
    echo "  shell          Access Django shell"
    echo "  backup         Backup database"
    echo "  clean          Clean up containers and volumes"
    echo "  update         Update and rebuild services"
    echo "  help           Show this help message"
    echo ""
}

start_services() {
    echo "Starting Naikoria Tech Academy..."
    docker-compose up -d --build
    echo "Services started. Visit http://localhost"
}

stop_services() {
    echo "Stopping all services..."
    docker-compose down
    echo "All services stopped."
}

restart_services() {
    echo "Restarting services..."
    docker-compose restart
    echo "Services restarted."
}

show_status() {
    echo "Service Status:"
    echo "==============="
    docker-compose ps
}

show_logs() {
    if [ -n "$2" ]; then
        echo "Showing logs for $2..."
        docker-compose logs -f "$2"
    else
        echo "Showing all service logs..."
        docker-compose logs -f
    fi
}

setup_platform() {
    echo "Setting up Naikoria Tech Academy..."
    docker-compose exec django python manage.py migrate
    docker-compose exec django python manage.py collectstatic --noinput
    ./setup_admin.sh
    echo "Setup complete!"
}

run_migrations() {
    echo "Running database migrations..."
    docker-compose exec django python manage.py migrate
    echo "Migrations completed."
}

django_shell() {
    echo "Opening Django shell..."
    docker-compose exec django python manage.py shell
}

backup_database() {
    echo "Creating database backup..."
    timestamp=$(date +"%Y%m%d_%H%M%S")
    docker-compose exec db pg_dump -U tutoring_user tutoring_platform > "backup_${timestamp}.sql"
    echo "Backup created: backup_${timestamp}.sql"
}

clean_system() {
    echo "Cleaning up containers and volumes..."
    docker-compose down -v
    docker system prune -f
    echo "Cleanup completed."
}

update_services() {
    echo "Updating services..."
    docker-compose pull
    docker-compose up -d --build
    echo "Services updated."
}

# Main command handler
case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$@"
        ;;
    setup)
        setup_platform
        ;;
    migrate)
        run_migrations
        ;;
    shell)
        django_shell
        ;;
    backup)
        backup_database
        ;;
    clean)
        clean_system
        ;;
    update)
        update_services
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use './manage_naikoria.sh help' for available commands"
        exit 1
        ;;
esac
-- Naikoria Tech Academy Database Initialization
-- PostgreSQL initialization script

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create database if not exists (this is handled by environment variables)
-- CREATE DATABASE tutoring_platform;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE tutoring_platform TO tutoring_user;

-- Create indexes for better performance (will be created after Django migrations)
-- These will be added after tables are created by Django

-- Insert initial data will be handled by Django fixtures and setup_admin.sh

-- Performance optimizations
ALTER DATABASE tutoring_platform SET timezone TO 'UTC';
ALTER DATABASE tutoring_platform SET client_encoding TO 'utf8';
ALTER DATABASE tutoring_platform SET default_transaction_isolation TO 'read committed';
ALTER DATABASE tutoring_platform SET client_min_messages TO warning;

-- Ensure proper permissions for the application user
GRANT CONNECT ON DATABASE tutoring_platform TO tutoring_user;
GRANT USAGE ON SCHEMA public TO tutoring_user;
GRANT CREATE ON SCHEMA public TO tutoring_user;

-- Grant all privileges on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO tutoring_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO tutoring_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO tutoring_user;

-- Log the initialization
SELECT 'Naikoria Tech Academy database initialized successfully!' as message;
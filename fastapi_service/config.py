"""
Configuration for Naikoria AI Service
"""
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Service configuration
    service_name: str = "Naikoria AI Service"
    debug: bool = True
    
    # Database
    database_url: str = "postgresql+asyncpg://tutoring_user:tutoring_pass@localhost:5432/tutoring_platform"
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # CORS
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000"
    ]
    
    # JWT
    secret_key: str = "naikoria-tech-academy-secret-key-change-in-production-2024"
    algorithm: str = "HS256"
    
    # AI Configuration
    openai_api_key: str = ""
    
    # Django Service Communication
    django_service_url: str = "http://localhost:8000"
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = "../.env"
        case_sensitive = False

settings = Settings()
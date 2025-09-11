#!/usr/bin/env python
import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tutoring_platform.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create admin user if it doesn't exist
username = 'admin'
email = 'admin@naikoria.com'
password = 'admin123'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
        first_name='Naik',
        last_name='Amal',
        user_type='admin'
    )
    print(f"✅ Superuser created successfully!")
    print(f"   Username: {username}")
    print(f"   Email: {email}")
    print(f"   Password: {password}")
else:
    print(f"ℹ️  Superuser '{username}' already exists")
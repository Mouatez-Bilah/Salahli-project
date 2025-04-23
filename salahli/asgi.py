"""
ASGI config for salahli project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'salahli.settings')

application = get_asgi_application() 
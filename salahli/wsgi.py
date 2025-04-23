"""
WSGI config for salahli project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'salahli.settings')

application = get_wsgi_application() 
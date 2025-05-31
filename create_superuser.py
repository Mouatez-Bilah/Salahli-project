import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'salahli.settings')
django.setup()

from repairs.models import User

# Create superuser
if not User.objects.filter(username='hafsi').exists():
    User.objects.create_superuser(
        username='hafsi',
        email='hhhafsi5@gmail.com',
        password='mehafsi'
    )
    print("Superuser created successfully!")
else:
    print("Superuser already exists!") 
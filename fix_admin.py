import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

def reset_admin():
    User = get_user_model()
    username = 'admin'
    email = 'admin@example.com'
    password = 'admin'

    try:
        user, created = User.objects.get_or_create(username=username, defaults={'email': email})
        
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()
        
        action = "Created" if created else "Updated"
        print(f"SUCCESS: {action} superuser '{username}' with password '{password}'")
        
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    reset_admin()

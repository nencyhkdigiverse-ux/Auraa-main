from django.contrib.auth import get_user_model
User = get_user_model()
username = 'admin'
email = 'admin@example.com'
password = 'admin'

try:
    if not User.objects.filter(username=username).exists():
        print(f'Creating superuser {username}...')
        User.objects.create_superuser(username, email, password)
    else:
        print(f'Updating password for {username}...')
        u = User.objects.get(username=username)
        u.set_password(password)
        u.is_staff = True
        u.is_superuser = True
        u.save()
    print('Admin user setup complete.')
except Exception as e:
    print(f'Error: {e}')

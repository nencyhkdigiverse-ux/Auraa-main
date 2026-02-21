import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import BulkInquiry

def check_data():
    count = BulkInquiry.objects.count()
    print(f"Total BulkInquiry objects: {count}")
    for obj in BulkInquiry.objects.all():
        print(f"- {obj.name} ({obj.email}): {obj.message[:20]}...")

if __name__ == "__main__":
    check_data()

# your_app_name/migrations/0002_generate_dummy_data.py

from django.db import migrations
from django.utils import timezone
from movie_booking_api.generate import create_dummy_data  # Import your serializer


class Migration(migrations.Migration):

    dependencies = [
        (
            "movie_booking_api",
            "0001_initial",
        ),  # Ensure this references the correct last migration
    ]

    operations = [
        migrations.RunPython(create_dummy_data),
    ]

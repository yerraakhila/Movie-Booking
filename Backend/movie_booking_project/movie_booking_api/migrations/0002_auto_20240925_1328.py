# Generated by Django 3.2 on 2024-09-25 13:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("movie_booking_api", "0001_initial"),
    ]

    from movie_booking_api.generate import create_dummy_data

    operations = [migrations.RunPython(create_dummy_data)]

# Generated by Django 3.2 on 2024-09-23 13:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movie_booking_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='actors',
            field=models.CharField(default=None, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='movie',
            name='director',
            field=models.CharField(default=None, max_length=255),
            preserve_default=False,
        ),
    ]

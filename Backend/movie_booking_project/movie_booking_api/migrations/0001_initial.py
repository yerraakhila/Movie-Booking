# Generated by Django 3.2 on 2024-09-25 13:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=20, unique=True)),
                ('name', models.CharField(max_length=20)),
                ('email', models.CharField(max_length=40)),
                ('password', models.CharField(max_length=10)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('rating', models.DecimalField(decimal_places=1, max_digits=3)),
                ('review', models.TextField()),
                ('genre', models.CharField(max_length=100)),
                ('languages', models.CharField(max_length=255)),
                ('release_date', models.DateField()),
                ('running_time', models.PositiveIntegerField()),
                ('trailer_url', models.URLField()),
                ('poster_url', models.URLField()),
                ('actors', models.CharField(max_length=255)),
                ('director', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Screening',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('city', models.CharField(max_length=100)),
                ('date_time', models.DateTimeField()),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='screenings', to='movie_booking_api.movie')),
            ],
        ),
        migrations.CreateModel(
            name='Theatre',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=500)),
                ('city', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Seat',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('row', models.CharField(max_length=1)),
                ('number', models.PositiveIntegerField()),
                ('is_premium', models.BooleanField(default=False)),
                ('is_booked', models.BooleanField(default=False)),
                ('cost', models.PositiveIntegerField()),
                ('screening', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='movie_booking_api.screening')),
            ],
        ),
        migrations.AddField(
            model_name='screening',
            name='theatre',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='screenings', to='movie_booking_api.theatre'),
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('booking_id', models.AutoField(primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled')], max_length=20)),
                ('screening', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='movie_booking_api.screening')),
                ('seats', models.ManyToManyField(to='movie_booking_api.Seat')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddIndex(
            model_name='screening',
            index=models.Index(fields=['movie', 'city', 'date_time'], name='movie_city_datetime_index'),
        ),
    ]

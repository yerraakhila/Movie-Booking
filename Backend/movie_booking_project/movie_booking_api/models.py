from django.db import models

from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


# Movie Model
class Movie(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    review = models.TextField()
    genre = models.CharField(max_length=100)
    languages = models.CharField(max_length=255)
    release_date = models.DateField()
    running_time = models.PositiveIntegerField()
    trailer_url = models.URLField()
    poster_url = models.URLField()
    actors = models.CharField(max_length=255)
    director = models.CharField(max_length=255)


# Theatre Model
class Theatre(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=500)
    city = models.CharField(max_length=100)


# Screening Model
class Screening(models.Model):
    id = models.AutoField(primary_key=True)
    movie = models.ForeignKey(
        Movie, on_delete=models.CASCADE, related_name="screenings"
    )
    theatre = models.ForeignKey(
        Theatre, on_delete=models.CASCADE, related_name="screenings"
    )
    city = models.CharField(max_length=100)
    date_time = models.DateTimeField()


# Seat Model
class Seat(models.Model):
    id = models.AutoField(primary_key=True)
    row = models.CharField(max_length=1)
    number = models.PositiveIntegerField()
    is_premium = models.BooleanField(default=False)
    is_booked = models.BooleanField(default=False)
    cost = models.PositiveIntegerField()
    screening = models.ForeignKey(Screening, on_delete=models.CASCADE)


# User Model
class UserManager(BaseUserManager):
    def create_user(self, username, password, name, email, **extra_fields):
        if not username:
            raise ValueError("username should be provided")
        if not email:
            raise ValueError("email should be provided")
        user = self.model(username=username, name=name, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password, name, email, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_superuser(
            self, username, password, name, email, **extra_fields
        )


class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=20)
    email = models.CharField(max_length=40)
    password = models.CharField(max_length=10)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["name", "email"]

    objects = UserManager()


# Booking Model
class Booking(models.Model):
    class BookingStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"

    booking_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    screening = models.ForeignKey(Screening, on_delete=models.CASCADE)
    seats = models.ManyToManyField(Seat)
    status = models.CharField(max_length=20, choices=BookingStatus.choices)

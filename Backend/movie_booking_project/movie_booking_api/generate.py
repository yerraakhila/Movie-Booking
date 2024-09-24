from django.utils import timezone
from .models import Booking, Movie, Theatre, Screening, Seat, User
from .serializers import (
    ScreeningSerializer,
    MovieSerializer,
    SeatSerializer,
    UserSerializer,
    LoginSerializer,
    BookingSerializer,
)


def generate_seats(screening):
    is_premium = True
    cost = 500
    for row_num in range(7):
        row = chr(ord("A") + row_num)
        for number in range(1, 11):
            Seat.objects.create(
                row=row,
                number=number,
                is_premium=is_premium,
                is_booked=False,
                cost=cost,
                screening=screening,
            )
        is_premium = False
        cost = 300


def generate_screening(movie, theatre):

    for i in range(1, 6):
        now = timezone.now()
        obj = {
            "movie": movie.id,  # Use movie ID
            "theatre": theatre.id,  # Use theatre ID
            "city": theatre.city,
            "date_time": now + timezone.timedelta(days=i),
        }
        serialized = ScreeningSerializer(data=obj)

        if serialized.is_valid():  # Check if the data is valid
            screening = serialized.save()  # Save the validated data
            generate_seats(screening)  # Generate seats for the created screening
        else:
            print(f"Error creating screening: {serialized.errors}")


def create_dummy_data():
    for movie in Movie.objects.all():
        for theatre in Theatre.objects.all():
            generate_screening(movie, theatre)

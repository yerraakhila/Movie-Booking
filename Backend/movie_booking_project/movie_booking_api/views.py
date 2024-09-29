from datetime import datetime, timedelta
from django.utils import timezone
from venv import logger
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework import status
from .models import Booking, Movie, Theatre, Screening, Seat, User
from .serializers import (
    ScreeningSerializer,
    MovieSerializer,
    SeatSerializer,
    UserSerializer,
    LoginSerializer,
    BookingSerializer,
)
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken


# select city
class MoviesListByCityView(APIView):
    def get(self, request, city):
        try:
            language = request.query_params.get("language")
            genre = request.query_params.get("genre")

            screenings = Screening.objects.filter(city=city)
            if not screenings.exists():
                return Response(
                    {"error": "No screenings available for theatres in this city."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Get movie IDs from the screenings
            movie_ids = screenings.values_list("movie_id", flat=True)

            # Get movies based on those IDs
            movies = Movie.objects.filter(id__in=movie_ids)
            if language:
                movies = movies.filter(languages=language)
            if genre:
                movies = movies.filter(genre__contains=genre)

            # Serialize and return movie data
            serialized = MovieSerializer(movies, many=True)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist as e:
            return Response(
                {"error": "Invalid data: " + str(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": "An error occurred: " + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class MovieSearchView(APIView):
    def get(self, request):
        search_text = request.query_params.get("query", "")
        # Return only 5 movies at max to frontend.
        movies = Movie.objects.filter(title__icontains=search_text)[:5]
        serialized = MovieSerializer(movies, many=True)
        return Response(serialized.data, status=status.HTTP_200_OK)


# select movie
class MovieDetailView(APIView):
    def get(self, request, city, movie_id):
        try:
            # Try to get the movie by its ID
            movie = Movie.objects.get(id=movie_id)
            serialized = MovieSerializer(movie)
            return Response(serialized.data, status=status.HTTP_200_OK)

        # If the movie is not found, return a 404 error
        except Movie.DoesNotExist:
            return Response(
                {"error": "Movie with this ID not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Catch any other exceptions and return a 500 error
        except Exception as e:
            return Response(
                {"error": "An error occurred: " + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# class MovieScreeningsView(APIView):
#     def get(self, request, movie_id):
#         try:
#             movie = Movie.objects.get(id=movie_id)
#             movie_screenings = movie.screenings
#             serialized = ScreeningSerializer(movie_screenings, many=True)
#             return Response(serialized.data, status=status.HTTP_200_OK)
#         except:
#             return Response(
#                 {"movie with this id not found"}, status=status.HTTP_400_BAD_REQUEST
#             )


# click on book tickets
class MovieScreeningsView(APIView):
    def get(self, request, city, date, movie_id):
        try:
            target_date = datetime.strptime(date, "%Y-%m-%d").date()
            start_datetime = timezone.make_aware(
                datetime.combine(target_date, datetime.min.time())
            )
            end_datetime = timezone.make_aware(
                datetime.combine(target_date, datetime.max.time())
            )
            # Fetch the movie or return 404 if not found
            movie = get_object_or_404(Movie, id=movie_id)

            print(
                f"Fetching screenings for Movie ID: {movie_id}, City: {city}, Date: {start_datetime, end_datetime}"
            )

            movie_screenings = Screening.objects.filter(
                Q(movie=movie)
                & Q(city=city)
                & Q(date_time__range=(start_datetime, end_datetime))
            )

            # Serialize the screenings
            serialized = ScreeningSerializer(movie_screenings, many=True)

            # Return the serialized data with 200 OK status
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Exception as e:
            # Return a more detailed error message
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# click on particular screening
class ScreeningSeatsView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, city, screening_id):
        try:
            # Try to fetch seats related to the screening ID
            seats = Seat.objects.filter(screening_id=screening_id)

            # Check if any seats are found, if not return 404
            if not seats.exists():
                return Response(
                    {"error": "No seats found for this screening."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Serialize the seat data and return
            serialized = SeatSerializer(seats, many=True)
            return Response(serialized.data, status=status.HTTP_200_OK)

        # If screening_id doesn't match any seat or invalid data, return a 404
        except Seat.DoesNotExist:
            return Response(
                {"error": "Screening ID not found."}, status=status.HTTP_404_NOT_FOUND
            )

        # General exception handling for any unexpected errors
        except Exception as e:
            return Response(
                {"error": "An error occurred: " + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SelectSeatsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        seats = request.data.pop("seats")
        seat_ids = [seat.get("id") for seat in seats]

        # Ensure that no more than 10 tickets are selected
        if len(seat_ids) > 10:
            return Response(
                {"detail": "You cannot select more than 10 tickets."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        minute_ago = timezone.now() - timedelta(minutes=1)

        booked_seats = Seat.objects.filter(
            id__in=seat_ids,
            booking__isnull=False,
        ).exclude(
            booking__status=Booking.BookingStatus.PENDING,
            booking__created_at__lte=minute_ago,
        )

        if booked_seats.exists():
            return Response(
                {
                    "detail": "Some of the selected seats are already booked or pending for less than a minute."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update the status to Pending
        request.data["status"] = Booking.BookingStatus.PENDING

        # Serialize the booking request
        serialized = BookingSerializer(
            data=request.data, context={"user": request.user}
        )

        if serialized.is_valid():
            # Save the booking and update the seats with this booking
            booking = serialized.save()

            # Associate the selected seats with this booking
            Seat.objects.filter(id__in=seat_ids).update(booking=booking)

            return Response(serialized.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


# check booking details
class BookingDetailInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, city, booking_id):
        try:
            booking = Booking.objects.get(booking_id=booking_id, user=request.user)
            serialized = BookingSerializer(booking)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Booking.DoesNotExist:
            return Response(
                {
                    "error": "Booking not found or you do not have permission to view this booking."
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            print(f"Unexpected error: {e}")
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# click pay
class BookingPayView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, booking_id):
        try:
            booking = Booking.objects.get(booking_id=booking_id, user=request.user)
            booking.status = Booking.BookingStatus.CONFIRMED
            booking.save()  # Save the updated booking status
            serialized = BookingSerializer(booking)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Booking.DoesNotExist:
            return Response(
                {
                    "error": "Booking not found or you do not have permission to update this booking."
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            print(f"Unexpected error: {e}")
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# confirmed booking details
class BookingConfirmedDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, city, booking_id):
        try:
            booking = Booking.objects.get(
                booking_id=booking_id,
                user=request.user,
                status=Booking.BookingStatus.CONFIRMED,
            )
            serialized = BookingSerializer(booking)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found or not confirmed."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            print(f"Unexpected error: {e}")
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class MyBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            bookings = Booking.objects.filter(
                user=user, status=Booking.BookingStatus.CONFIRMED
            ).order_by("-updated_at")

            if not bookings:
                raise NotFound("No bookings found for this user.")

            serialized = BookingSerializer(bookings, many=True)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except NotFound as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serialized = UserSerializer(user)
        return Response(serialized.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        data = request.data

        allowed_fields = {"name", "username", "email", "password"}

        if set(data.keys()).issubset(allowed_fields):
            if "username" in data and data["username"] != user.username:
                # Check if the username already exists
                if User.objects.filter(username=data["username"]).exists():
                    raise ValidationError(
                        {"username": "This username is already taken."}
                    )
            for field, value in data.items():
                # Hash the password
                if field == "password":
                    user.set_password(value)
                else:
                    setattr(user, field, value)

            user.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {"refresh": str(refresh), "access": str(refresh.access_token)},
                status=status.HTTP_201_CREATED,
            )

        return Response({"error": "Invalid fields"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = request.user
        user.delete()  # Delete the user instance from the database
        return Response(
            {"message": "Account deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )


class SignupView(APIView):
    def post(self, request):
        serialized = UserSerializer(data=request.data)
        if serialized.is_valid():
            user = serialized.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {"refresh": str(refresh), "access": str(refresh.access_token)},
                status=status.HTTP_201_CREATED,
            )
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


class SigninView(APIView):
    def post(self, request):
        serialized = LoginSerializer(data=request.data)
        if serialized.is_valid():
            user = serialized.validated_data
            refresh = RefreshToken.for_user(user)
            return Response(
                {"refresh": str(refresh), "access": str(refresh.access_token)},
                status=status.HTTP_200_OK,
            )
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


# class SingleScreeningInfo(APIView):
#     def get(self,request,screening_id):
#         screening = Screening.objects.get(id=screening_id)
#         serialized = ScreeningSerializer(screening)
#         return Response(serialized.data, status=status.HTTP_200_OK)


# get single screening
class SingleScreeningInfoView(APIView):
    def get(self, request, city, screening_id):
        # Use get_object_or_404 for better error handling
        screening = get_object_or_404(Screening, id=screening_id)
        serialized = ScreeningSerializer(screening)
        return Response(serialized.data, status=status.HTTP_200_OK)

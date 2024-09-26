from datetime import datetime
from django.utils import timezone
from venv import logger
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
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
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken


class AddScreeningView(APIView):
    def post(self, request):
        from .generate import create_dummy_data

        create_dummy_data()
        # movie = Movie.objects.get(id=request.data.get("movie"))
        # theatre = Theatre.objects.get(id=request.data.get("theatre"))
        # serialized = ScreeningSerializer(data=request.data)
        # if serialized.is_valid():
        #     serialized.save()
        #     return Response(serialized.data, status=status.HTTP_201_CREATED)
        # else:
        #     return Response(
        #         {"errors": serialized.errors}, status=status.HTTP_400_BAD_REQUEST
        #     )


class AddSeatView(APIView):
    def post(self, request):
        screening = Screening.objects.get(id=request.data.get("screening"))
        serialized = SeatSerializer(data=request.data)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"errors": serialized.errors}, status=status.HTTP_400_BAD_REQUEST
            )


# class MoviesListByCityView(APIView):
#     def get(self, request, city):
#         theatres = Theatre.objects.filter(city=city)
#         theatre_ids = theatres.values_list("id", flat=True)
#         theatre_ids_list = list(theatre_ids)
#         screenings = Screening.objects.filter(theatre_id__in=theatre_ids_list)
#         movied_ids = screenings.values_list("movie_id", flat=True)
#         movies = Movie.objects.filter(id__in=movied_ids)
#         serialized = MovieSerializer(movies,many=True)
#         return Response(serialized.data, status=status.HTTP_200_OK)


# select city
class MoviesListByCityView(APIView):
    def get(self, request, city):
        try:
            # Get theatres in the specified city
            theatres = Theatre.objects.filter(city=city)
            if not theatres.exists():
                return Response(
                    {"error": "No theatres found in this city."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Extract theatre IDs
            theatre_ids = theatres.values_list("id", flat=True)
            theatre_ids_list = list(theatre_ids)

            # Get screenings in those theatres
            screenings = Screening.objects.filter(theatre_id__in=theatre_ids_list)
            if not screenings.exists():
                return Response(
                    {"error": "No screenings available for theatres in this city."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Get movie IDs from the screenings
            movie_ids = screenings.values_list("movie_id", flat=True)

            # Get movies based on those IDs
            movies = Movie.objects.filter(id__in=movie_ids)
            if not movies.exists():
                return Response(
                    {"error": "No movies found for this city."},
                    status=status.HTTP_404_NOT_FOUND,
                )

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


# class MovieDetailView(APIView):
#     def get(self, request, movie_id):
#         try:
#             movie = Movie.objects.get(id=movie_id)
#             serialized = MovieSerializer(movie)
#             return Response(serialized.data, status=status.HTTP_200_OK)
#         except:
#             return Response({"movie with this id not found"},status=status.HTTP_400_BAD_REQUEST)


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

            # Get all screenings related to this movie
            from django.db.models import Q

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


# class ScreeningSeatsView(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request, screening_id):
#         try:
#             seats = Seat.objects.filter(screening_id=screening_id)
#             serialized = SeatSerializer(seats,many=True)
#             return Response(serialized.data,status=status.HTTP_200_OK)
#         except:
#             return Response({"screening id not found"},status=status.HTTP_400_BAD_REQUEST)


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


# class SelectSeatsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         request.data["status"] = Booking.BookingStatus.PENDING
#         serialized = BookingSerializer(
#             data=request.data, context={"user": request.user}
#         )
#         if serialized.is_valid():
#             serialized.save()
#             return Response(serialized.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


# select seats and click confirm
class SelectSeatsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data)
        data = request.data  # Safely copy the request data
        data["status"] = Booking.BookingStatus.PENDING

        serialized = BookingSerializer(data=data, context={"user": request.user})

        if serialized.is_valid():
            try:
                serialized.save()
                return Response(serialized.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                # Log the exception and return a 500 response
                logger.error(f"Error saving booking: {str(e)}")
                return Response(
                    {"detail": "An error occurred while saving the booking."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


# class BookingDetailInfoView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, booking_id):
#         try:
#             booking = Booking.objects.get(booking_id=booking_id, user=request.user)
#             serialized = BookingSerializer(booking)
#             return Response(serialized.data, status=status.HTTP_200_OK)

#         except Exception as e:
#             print(e)
#             return Response(
#                 {"booking id not found"}, status=status.HTTP_400_BAD_REQUEST
#             )


# check booking details
class BookingDetailInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
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


# class BookingPayView(APIView):
#     permission_classes = [IsAuthenticated]

#     def put(self,request,booking_id):
#         try:
#             booking = Booking.objects.get(booking_id=booking_id, user=request.user)
#             booking.status = Booking.BookingStatus.CONFIRMED
#             booking.save()
#             serialized = BookingSerializer(booking)
#             return Response(serialized.data, status=status.HTTP_200_OK)
#         except Exception as e:
#             print(e)
#             return Response(
#                 {"booking id not found"}, status=status.HTTP_400_BAD_REQUEST
#             )


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


# class BookingConfirmedDetailView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, booking_id):
#         try:
#             booking = Booking.objects.get(booking_id=booking_id, user=request.user,status=Booking.BookingStatus.CONFIRMED)
#             serialized = BookingSerializer(booking)
#             return Response(serialized.data, status=status.HTTP_200_OK)
#         except:
#             return Response(
#                 {"booking id not found"}, status=status.HTTP_400_BAD_REQUEST
#             )


# confirmed booking details
class BookingConfirmedDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
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


# class MyBookingsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self,request):
#         bookings = Booking.objects.filter(user=request.user, status=Booking.BookingStatus.CONFIRMED)
#         serialized = BookingSerializer(bookings,many=True)
#         return Response(serialized.data, status=status.HTTP_200_OK)


# my bookings
class MyBookingsView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access

    def get(self, request):
        bookings = Booking.objects.filter(
            user=request.user, status=Booking.BookingStatus.CONFIRMED
        )

        if bookings.exists():  # Check if there are any bookings
            serialized = BookingSerializer(bookings, many=True)
            return Response(serialized.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "No bookings found."}, status=status.HTTP_404_NOT_FOUND
            )


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serialized = UserSerializer(user)
        return Response(serialized.data, status=status.HTTP_200_OK)


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
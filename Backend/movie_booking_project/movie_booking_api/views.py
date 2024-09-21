from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Movie, Theatre, Screening,Seat
from .serializers import ScreeningSerializer, MovieSerializer,SeatSerializer
from django.core.exceptions import ObjectDoesNotExist


class AddScreeningView(APIView):
    def post(self, request):
        movie = Movie.objects.get(id=request.data.get("movie"))
        theatre = Theatre.objects.get(id=request.data.get("theatre"))
        serialized = ScreeningSerializer(data=request.data)
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


class MovieDetailView(APIView):
    def get(self, request, movie_id):
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

class MovieScreeningsView(APIView):
    def get(self, request, movie_id):
        try:
            # Fetch the movie or return 404 if not found
            movie = get_object_or_404(Movie, id=movie_id)
            
            # Get all screenings related to this movie
            movie_screenings = Screening.objects.filter(movie=movie)
            
            # Serialize the screenings
            serialized = ScreeningSerializer(movie_screenings, many=True)
            
            # Return the serialized data with 200 OK status
            return Response(serialized.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Return a more detailed error message
            return Response(
                {"error": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )

# class ScreeningSeatsView(APIView):
#     def get(self, request, screening_id):
#         seats = Seat.objects.get(screening_id=screening_id)
#         serialized = SeatSerializer(seats,many=True)
        
        


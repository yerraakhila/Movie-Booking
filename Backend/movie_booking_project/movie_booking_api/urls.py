from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import MoviesListByCityView,AddScreeningView,MovieDetailView,MovieScreeningsView

urlpatterns = [
    path('add-screening/',csrf_exempt(AddScreeningView.as_view()),name="add-screening"),
    path('movies/<str:city>/',csrf_exempt(MoviesListByCityView.as_view()),name="movies-list-by-city"),
    path('movie-detail/<int:movie_id>/',csrf_exempt(MovieDetailView.as_view()),name="movie-detail"),
    path('movie-screenings/<int:movie_id>/',csrf_exempt(MovieScreeningsView.as_view()),name="movie-screenings")
    
]

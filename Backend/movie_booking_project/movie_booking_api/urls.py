from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import (
    MovieSearchView,
    MoviesListByCityView,
    MovieDetailView,
    MovieScreeningsView,
    ScreeningSeatsView,
    SelectSeatsView,
    BookingDetailInfoView,
    BookingPayView,
    BookingConfirmedDetailView,
    MyBookingsView,
    UserProfileView,
    SigninView,
    SignupView,
    SingleScreeningInfoView,
)

urlpatterns = [
    path(
        "movies/<str:city>/",
        csrf_exempt(MoviesListByCityView.as_view()),
        name="movies-list-by-city",
    ),
    path(
        "movies-search/",
        csrf_exempt(MovieSearchView.as_view()),
        name="movies-search",
    ),
    path(
        "<str:city>/movie-detail/<int:movie_id>/",
        csrf_exempt(MovieDetailView.as_view()),
        name="movie-detail",
    ),
    path(
        "<str:city>/movie-screenings/<int:movie_id>/<str:date>/",
        csrf_exempt(MovieScreeningsView.as_view()),
        name="movie-screenings",
    ),
    path(
        "<str:city>/screening-seats/<int:screening_id>/",
        csrf_exempt(ScreeningSeatsView.as_view()),
        name="screening-seats",
    ),
    path("select-seats/", csrf_exempt(SelectSeatsView.as_view()), name="select-seats"),
    path(
        "<str:city>/booking-detail/<int:booking_id>/",
        csrf_exempt(BookingDetailInfoView.as_view()),
        name="booking-detail-info",
    ),
    path(
        "booking-pay/<int:booking_id>/",
        csrf_exempt(BookingPayView.as_view()),
        name="booking-pay",
    ),
    path(
        "<str:city>/booking-confirmed-detail/<int:booking_id>/",
        csrf_exempt(BookingConfirmedDetailView.as_view()),
        name="booking-confirmed-details",
    ),
    path(
        "my-bookings/",
        csrf_exempt(MyBookingsView.as_view()),
        name="my-bookings",
    ),
    path("user-profile/", csrf_exempt(UserProfileView.as_view()), name="user-profile"),
    path("signup/", csrf_exempt(SignupView.as_view()), name="signup"),
    path("signin/", csrf_exempt(SigninView.as_view()), name="signin"),
    path(
        "<str:city>/single-screening/<int:screening_id>/",
        csrf_exempt(SingleScreeningInfoView.as_view()),
        name="single-screening-info",
    ),
]

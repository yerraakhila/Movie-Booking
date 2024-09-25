from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import (
    MoviesListByCityView,
    AddScreeningView,
    MovieDetailView,
    MovieScreeningsView,
    ScreeningSeatsView,
    AddSeatView,
    SelectSeatsView,
    BookingDetailInfoView,
    BookingPayView,
    BookingConfirmedDetailView,
    MyBookingsView,
    UserProfileView,
    SigninView,
    SignupView,
)

urlpatterns = [
    path(
        "add-screening/", csrf_exempt(AddScreeningView.as_view()), name="add-screening"
    ),
    path("add-seat/", csrf_exempt(AddSeatView.as_view()), name="add-seat"),
    path(
        "movies/<str:city>/",
        csrf_exempt(MoviesListByCityView.as_view()),
        name="movies-list-by-city",
    ),
    path(
        "movie-detail/<int:movie_id>/",
        csrf_exempt(MovieDetailView.as_view()),
        name="movie-detail",
    ),
    path(
        "movie-screenings/<int:movie_id>/",
        csrf_exempt(MovieScreeningsView.as_view()),
        name="movie-screenings",
    ),
    path(
        "screening-seats/<int:screening_id>/",
        csrf_exempt(ScreeningSeatsView.as_view()),
        name="screening-seats",
    ),
    path("select-seats/", csrf_exempt(SelectSeatsView.as_view()), name="select-seats"),
    path(
        "booking-detail/<int:booking_id>/",
        csrf_exempt(BookingDetailInfoView.as_view()),
        name="booking-detail-info",
    ),
    path(
        "booking-pay/<int:booking_id>/",
        csrf_exempt(BookingPayView.as_view()),
        name="booking-pay",
    ),
    path(
        "booking-confirmed-detail/<int:booking_id>/",
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
]

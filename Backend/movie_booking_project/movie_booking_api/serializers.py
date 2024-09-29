from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Movie, Theatre, Screening, Seat, Booking, User
from rest_framework.exceptions import ValidationError


class ScreeningSerializer(serializers.ModelSerializer):
    movie_object = serializers.SerializerMethodField()
    theatre_object = serializers.SerializerMethodField()

    class Meta:
        model = Screening
        fields = [
            "id",
            "movie",
            "theatre",
            "city",
            "date_time",
            "movie_object",
            "theatre_object",
        ]

    def get_movie_object(self, obj):
        return MovieSerializer(obj.movie).data

    def get_theatre_object(self, obj):
        return TheatreSerializer(obj.theatre).data


class MovieSerializer(serializers.ModelSerializer):

    class Meta:
        model = Movie
        fields = "__all__"  # Or specify the fields you want to include


class TheatreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theatre
        fields = "__all__"  # Or specify the fields you want to include


class SeatSerializer(serializers.ModelSerializer):
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = Seat
        fields = [
            "id",
            "row",
            "number",
            "is_premium",
            "cost",
            "screening",
            "booking",
            "is_available",
        ]  # Or specify the fields you want to include

    def get_is_available(self, obj):
        return obj.booking is None


# Booking Serializer
class BookingSerializer(serializers.ModelSerializer):
    seats = SeatSerializer(many=True, read_only=True)
    screening_object = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "booking_id",
            "screening",
            "status",
            "seats",
            "screening_object",
            "created_at",
            "updated_at",
        ]

    # def get_seat_objects(self, obj):
    #     seat_objects = Seat.objects.filter(
    #         id__in=obj.seats.values_list("id", flat=True)
    #     )  # Get all seat objects related to the booking
    #     return SeatSerializer(seat_objects, many=True).data

    def get_screening_object(self, obj):
        screening_object = Screening.objects.get(id=obj.screening.id)
        return ScreeningSerializer(screening_object).data

    def create(self, validated_data):
        user = self.context["user"]
        booking = Booking.objects.create(user=user, **validated_data)
        return booking


class UserSerializer(serializers.ModelSerializer):
    bookings = BookingSerializer(many=True, read_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "name", "email", "password", "bookings"]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data["email"],
            name=validated_data["name"],
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data["username"], password=data["password"])
        if user and user.is_active:
            return user
        raise ValidationError("invalid credentials")

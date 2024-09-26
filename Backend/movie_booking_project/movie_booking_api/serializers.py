from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import Movie, Theatre, Screening, Seat, Booking, User


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

    class Meta:
        model = Seat
        fields = "__all__"  # Or specify the fields you want to include


# Booking Serializer
class BookingSerializer(serializers.ModelSerializer):
    # user = serializers.StringRelatedField()
    # screening = ScreeningSerializer()
    # seats = serializers.PrimaryKeyRelatedField(many=True, queryset=Seat.objects.all())
    seat_objects = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ["booking_id", "screening", "seats", "status", "seat_objects"]

    def get_seat_objects(self, obj):
        seat_objects = Seat.objects.filter(
            id__in=obj.seats.values_list("id", flat=True)
        )  # Get all seat objects related to the booking
        return SeatSerializer(seat_objects, many=True).data

    def create(self, validated_data):
        user = self.context["user"]
        seats = validated_data.pop("seats")
        booking = Booking.objects.create(user=user, **validated_data)
        booking.seats.set(seats)  # Set the seats for the booking
        return booking


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "name", "email", "password"]

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
        raise serializers.validationError("invalid credentials")

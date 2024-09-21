# from django.contrib.auth.models import authenticate
from rest_framework import serializers
from .models import Movie, Theatre, Screening, Seat
from django.core.exceptions import ObjectDoesNotExist

class ScreeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screening
        fields = ["movie", "theatre"]
        
class MovieSerializer(serializers.ModelSerializer):
    screenings = ScreeningSerializer(many=True)
    class Meta:
        model = Movie
        fields = "__all__"  # Or specify the fields you want to include


class TheatreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theatre
        fields = "__all__"  # Or specify the fields you want to include




    # def create(self, validated_data):
    #     try:
    #         movie = Movie.objects.get(id=validated_data.pop("movie")["id"])
    #         theatre = Theatre.objects.get(id=validated_data.pop("theatre")["id"])
    #         screening = Screening.objects.create(
    #             movie=movie, theatre=theatre, **validated_data
    #         )
    #         return screening
    #     except ObjectDoesNotExist as e:
    #         raise serializers.ValidationError(str(e))
    #     except Exception as e:
    #         raise serializers.ValidationError("An error occurred: " + str(e))


class SeatSerializer(serializers.ModelSerializer):
    screening = ScreeningSerializer()  # Nested serializer for Screening

    class Meta:
        model = Seat
        fields = "__all__"  # Or specify the fields you want to include


# # Booking Serializer
# class BookingSerializer(serializers.ModelSerializer):
#     user = serializers.StringRelatedField()
#     screening = ScreeningSerializer()
#     seats = SeatSerializer(many=True)

#     class Meta:
#         model = Booking
#         fields = '__all__'

# class UserSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         fields = ["id", "username", "name", "email", "password"]

#     def create(self, validated_data):
#         return User.objects.create_user(
#             username=validated_data["username"], password=validated_data["password"]
#         )

# class LoginSerializer(serializers.Serializer):
#     username = serializers.CharField()
#     password = serializers.CharField(write_only=True)

#     def validate(self, data):
#         user = authenticate(username=data['username'],password=data['password'])
#         if user and user.is_active:
#             return user
#         raise serializers.validationError("invalid credentials")

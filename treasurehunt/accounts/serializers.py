import datetime

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


from treasurehunt.accounts.models import Profile, EmailTokenExpiration
from treasurehunt.common.tokens import account_activation_token

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username')

    class Meta:
        model = Profile
        fields = ['pk', 'user', 'first_name', 'last_name', 'is_active', ]


class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(allow_blank=False)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],

        )
        user.password = make_password(validated_data['password'])

        user_details = Profile.objects.create(
            user=user,
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_active=False,
        )

        user.save()
        return user_details

    def validate_username(self, value):
        user = User.objects.filter(username=value)
        if user:
            raise serializers.ValidationError(f"Username: {value} already exist.")
        return value

    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError('This email is already in use.')
        return value


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        user_profile = Profile.objects.get(user=self.user)
        user_serializer = UserSerializer
        data["user"] = user_serializer(user_profile).data
        return data


class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('old_password', 'password', 'password2')

    def validate_password(self, password):
        if password != self.initial_data['password2']:
            raise serializers.ValidationError("Password fields didn't match.")

        return password

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if user.pk != instance.pk:
            raise serializers.ValidationError({"authorize": "You dont have permission for this user."})

        instance.password = make_password(validated_data['password'])
        instance.save()

        return instance


class UpdateUserSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    password = serializers.CharField(write_only=True, required=True)

    def validate_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Password is not correct")
        return value

    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError('This email is already in use.')
        return value

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if user.pk != instance.pk:
            raise serializers.ValidationError({"authorize": "You dont have permission for this user."})

        user_fields = ('email', 'first_name', 'last_name')
        user_details = User.objects.get(user=user)
        for key in validated_data.keys():
            if key in user_fields:
                user_object = instance
            else:
                user_object = user_details
            if key != 'password':
                setattr(user_object, key, validated_data[key])

        instance.save()
        user_details.save()

        return {
            "email": instance.email,
            "first_name": instance.first_name,
            "last_name": instance.last_name,
        }


class ResetPasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    token = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('token', 'password', 'password2',)

    def validate_password(self, password):
        if password != self.initial_data['password2']:
            raise serializers.ValidationError("Password fields didn't match.")

        return password

    def validate_token(self, token):
        email_token_expiration_minutes = 10
        email_token_expiration = EmailTokenExpiration.objects.filter(user=self.instance, token=token)
        if not email_token_expiration.exists():
            raise serializers.ValidationError("Invalid token.")
        if email_token_expiration.first().is_expired or email_token_expiration.first().created_at.replace(
                tzinfo=None) < datetime.datetime.utcnow() - datetime.timedelta(
            minutes=email_token_expiration_minutes):
            raise serializers.ValidationError("Invalid token.")
        return token

    def update(self, instance, validated_data):
        email_token_expiration = EmailTokenExpiration.objects.get(user=instance, token=validated_data['token'])
        if account_activation_token.check_token(instance, validated_data['token']):
            instance.password = make_password(validated_data['password'])
            instance.save()
            email_token_expiration.is_expired = True
            email_token_expiration.save()
        else:
            raise serializers.ValidationError({'authorize': 'Invalid token.'})

        return instance

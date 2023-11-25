from django.contrib.auth import get_user_model
from django.http import HttpResponseBadRequest
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics as rest_generics, status
from rest_framework.response import Response

from .models import EmailTokenExpiration
from .serializers import ChangePasswordSerializer, UpdateUserSerializer, \
    ResetPasswordSerializer, UserSerializer, RegistrationSerializer, MyTokenObtainPairSerializer
from .. import settings
from ..common.mixins import SendEmailMixin
from ..common.throttling import UserLoginRateThrottle
from ..common.tokens import account_activation_token

User = get_user_model()


class RegisterUser(rest_generics.GenericAPIView, SendEmailMixin):
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token = account_activation_token.make_token(user.user)
        email_token_expiration = EmailTokenExpiration.objects.create(user=user.user, token=token)
        email_token_expiration.save()

        protocol = 'http'
        if request.is_secure():
            protocol = 'https'

        context = {
            'protocol': protocol,
            'domain': settings.DOMAIN,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': token,
        }
        # self.send_mail(
        #     'Confirm your email',
        #     context,
        #     settings.DEFAULT_FROM_EMAIL,
        #     user.user.email,
        #     'account_activation.html',
        # )
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
        })


class CustomTokenObtainPairView(TokenObtainPairView):
    # throttle_classes = (UserLoginRateThrottle,)
    serializer_class = MyTokenObtainPairSerializer


class ChangePasswordView(rest_generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ChangePasswordSerializer


class UpdateUserView(rest_generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UpdateUserSerializer


class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def get(request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None:
            email_token_expiration = EmailTokenExpiration.objects.filter(user=user, token=token)
            if not email_token_expiration.exists():
                return HttpResponseBadRequest('Invalid token.')
            email_token_expiration = email_token_expiration.first()
            if not email_token_expiration.is_expired and account_activation_token.check_token(user, token):
                user.is_active = True
                user.save()
                email_token_expiration.is_expired = True
                email_token_expiration.save()
                return Response({'detail': 'Email confirmed.'}, status=status.HTTP_200_OK)
        else:
            return HttpResponseBadRequest('Invalid token.')


class ResendEmailView(APIView, SendEmailMixin):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'email': 'No user with this email address found.'}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_active:
            return Response({'email': 'This account has already been activated.'}, status=status.HTTP_400_BAD_REQUEST)

        token = account_activation_token.make_token(user)
        email_token_expiration = EmailTokenExpiration.objects.create(user=user, token=token)
        email_token_expiration.save()

        # protocol = 'http'
        # if request.is_secure():
        #     protocol = 'https'
        #
        # context = {
        #     'protocol': protocol,
        #     'domain': settings.DOMAIN,
        #     'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        #     'token': account_activation_token.make_token(user),
        # }
        #
        # self.send_mail(
        #     'Confirm your email',
        #     context,
        #     settings.DEFAULT_FROM_EMAIL,
        #     user.email,
        #     'account_activation.html',
        # )
        return Response({'detail': 'An email with activation instructions has been sent to your email address'})


class PasswordResetView(rest_generics.GenericAPIView, SendEmailMixin):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        email = request.data.get('email')
        front_side_token = request.data.get('token')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'email': 'No user with this email address found.'}, status=status.HTTP_400_BAD_REQUEST)

        token = account_activation_token.make_token(user)
        password_reset = EmailTokenExpiration.objects.create(user=user, token=token)
        password_reset.save()

        protocol = 'http'
        if request.is_secure():
            protocol = 'https'

        context = {
            'protocol': protocol,
            'domain': settings.DOMAIN,
            'uid': user.pk,
            'token': token,
            'front_side_token': front_side_token,
        }

        self.send_mail(
            'Reset your password',
            context,
            settings.DEFAULT_FROM_EMAIL,
            user.email,
            'reset_password.html',
        )
        return Response({'detail': 'Password reset email has been sent.'}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(rest_generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ResetPasswordSerializer

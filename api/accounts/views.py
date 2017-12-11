from authemail.models import PasswordResetCode, SignupCode, send_multi_format_email
from authemail.views import (Login, Logout, PasswordResetVerified,
                             UserMe, PasswordReset, SignupVerify, Signup)
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.utils.timezone import now
from django.utils.translation import gettext as _
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings

from .serializers import UserSerializer, CustomSignupSerializer

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class CustomSignup(Signup):
    serializer_class = CustomSignupSerializer

    def post(self, request, format=None):
        serializer = CustomSignupSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.data['email']
            password = serializer.data['password']
            first_name = serializer.data['first_name']
            last_name = serializer.data['last_name']
            phone = serializer.data['phone']

            must_validate_email = getattr(settings, "AUTH_EMAIL_VERIFICATION", True)

            try:
                user = get_user_model().objects.get(email=email)
                if user.is_verified:
                    content = {'detail':
                               _('User with this Email address already exists.')}
                    return Response(content, status=status.HTTP_400_BAD_REQUEST)

                try:
                    # Delete old signup codes
                    signup_code = SignupCode.objects.get(user=user)
                    signup_code.delete()
                except SignupCode.DoesNotExist:
                    pass

            except get_user_model().DoesNotExist:
                user = get_user_model().objects.create_user(email=email)

            # Set user fields provided
            user.set_password(password)
            user.first_name = first_name
            user.last_name = last_name
            user.phone = phone
            if not must_validate_email:
                user.is_verified = True
                send_multi_format_email('welcome_email',
                                        {'email': user.email, },
                                        target_email=user.email)
            user.save()

            if must_validate_email:
                # Create and associate signup code
                ipaddr = self.request.META.get('REMOTE_ADDR', '0.0.0.0')
                signup_code = SignupCode.objects.create_signup_code(user, ipaddr)
                signup_code.send_signup_email()

            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomLogin(Login):
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.data['email']
            password = serializer.data['password']
            user = authenticate(email=email, password=password)

            if user:
                if user.is_active:
                    payload = jwt_payload_handler(user)
                    token = jwt_encode_handler(payload)
                    get_user_model().objects.filter(pk=user.pk) \
                        .update(last_login=now())
                    return Response({'token': token},
                                    status=status.HTTP_200_OK)
                else:
                    content = {'detail': _('User account not active.'),
                               'key': 'account_not_active'}
                    return Response(content,
                                    status=status.HTTP_401_UNAUTHORIZED)
            else:
                content = {'detail':
                           _('Unable to login with provided credentials.'),
                           'key': 'login_failed'}
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)

        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


class CustomLogout(Logout):
    def get(self, request, format=None):
        """
        Remove all auth tokens owned by request.user.
        """
        content = {'success': _('User logged out.')}
        return Response(content, status=status.HTTP_200_OK)


class CustomPasswordResetVerified(PasswordResetVerified):
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            code = serializer.data['code']
            password = serializer.data['password']

            try:
                password_reset_code = PasswordResetCode.objects.get(code=code)
                password_reset_code.user.set_password(password)
                password_reset_code.user.save()
                password_reset_code.delete()
                content = {'success': _('Password reset.')}
                return Response(content, status=status.HTTP_200_OK)
            except PasswordResetCode.DoesNotExist:
                content = {'detail': _('Unable to verify user.')}
                return Response(content, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


class CustomUserMe(UserMe):
    serializer_class = UserSerializer

    def put(self, request, format=None):
        serializer = self.serializer_class(request.user, data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

        old_email = request.user.email
        user = serializer.update(request.user,
                                 validated_data=serializer.validated_data)

        content = {'user': serializer.data}
        if not old_email == user.email:
            payload = jwt_payload_handler(user)
            content['token'] = jwt_encode_handler(payload)

            if getattr(settings, "AUTH_EMAIL_VERIFICATION", True):
                try:
                    # Delete old signup codes
                    signup_code = SignupCode.objects.get(user=user)
                    signup_code.delete()
                except SignupCode.DoesNotExist:
                    pass

                # Create and associate signup code
                ipaddr = self.request.META.get('REMOTE_ADDR', '0.0.0.0')
                signup_code = SignupCode.objects.create_signup_code(user,
                                                                    ipaddr)
                signup_code.send_signup_email()

                content['email_sent'] = True
                user.is_verified = False
                user.save()
                content['user']['is_verified'] = False

        return Response(content, status=status.HTTP_200_OK)


class CustomPasswordReset(PasswordReset):
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.data['email']

            try:
                user = get_user_model().objects.get(email=email)
                if user.is_verified and user.is_active:
                    PasswordResetCode.objects.filter(user=user).delete()
                    password_reset_code = \
                        PasswordResetCode.objects.create_reset_code(user)
                    password_reset_code.send_password_reset_email()
                    content = {'email': email}
                    return Response(content, status=status.HTTP_201_CREATED)

            except get_user_model().DoesNotExist:
                pass

            # Since this is AllowAny, don't give away error.
            content = {'detail': _('Password reset not allowed.')}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


class CustomSignupVerify(SignupVerify):
    def get(self, request, format=None):
        code = request.GET.get('code', '')
        verified = SignupCode.objects.set_user_is_verified(code)

        if verified:
            try:
                signup_code = SignupCode.objects.get(code=code)
                SignupCode.objects.filter(user=signup_code.user).delete()
            except SignupCode.DoesNotExist:
                pass
            content = {'success': _('User verified.')}
            return Response(content, status=status.HTTP_200_OK)
        else:
            content = {'detail': _('Unable to verify user.')}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)


class ResendVerification(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user

        if user.is_verified:
            content = {'detail': _('User already verified.')}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        ipaddr = self.request.META.get('REMOTE_ADDR', '0.0.0.0')
        signup_code = SignupCode.objects.create_signup_code(user, ipaddr)
        signup_code.send_signup_email()

        content = {'success': _('Email sent.')}
        return Response(content, status=status.HTTP_200_OK)

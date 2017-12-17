import json

from django.core import mail
from django.core.urlresolvers import reverse
from django.test import TransactionTestCase
from django.utils.translation import activate
from rest_framework.test import APIClient
from rest_framework_jwt.settings import api_settings

from api.accounts.models import MyUser

activate('en-us')

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class ResendVerificationTestCase(TransactionTestCase):
    token = None
    user = None

    def setUp(self):
        self.user = MyUser.objects.create(email='test@byom.de',
                                          first_name='Test',
                                          last_name='User',
                                          phone='+49192481024')
        self.user.set_password('test123')
        self.user.is_verified = False
        self.user.save()
        payload = jwt_payload_handler(self.user)
        self.token = jwt_encode_handler(payload)

    def test_resend_verification_unauthorized(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-resend-verification'))
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'],
                         'Authentication credentials were not provided.')
        self.assertEqual(len(mail.outbox), 0)

    def test_resend_verification_invalid_token(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT absolute_invalid_token')
        response = client.post(reverse('v1:authemail-resend-verification'))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(len(mail.outbox), 0)

    def test_resend_verification_success(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:authemail-resend-verification'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Confirm your Email Address')
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['success'],
                         'Email sent.')

    def test_resend_verification_verified_user(self):
        self.user.is_verified = True
        self.user.save()

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:authemail-resend-verification'))
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'],
                         'User already verified.')
        self.assertEqual(len(mail.outbox), 0)

import json

from authemail.models import PasswordResetCode
from django.core.urlresolvers import reverse
from django.test import TransactionTestCase
from django.utils.translation import activate
from rest_framework.test import APIClient

from api.accounts.models import MyUser

activate('en-us')


class PasswordResetVerifyTestCase(TransactionTestCase):
    code = None

    def setUp(self):
        user = MyUser.objects.create(email='test@byom.de', first_name='Test', last_name='User', phone='+49192481024')
        user.set_password('test123')
        user.is_verified = True
        user.save()
        self.code = PasswordResetCode.objects.create_reset_code(user)\
            .code.decode('utf-8')

    def test_reset_password_verify_valid(self):
        client = APIClient()
        response = client.get(reverse('v1:authemail-password-reset-verify'),
                              {'code': self.code})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['success'], 'User verified.')

    def test_reset_password_verify_empty(self):
        client = APIClient()
        response = client.get(reverse('v1:authemail-password-reset-verify'))
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'], 'Unable to verify user.')

    def test_reset_password_verify(self):
        client = APIClient()
        response = client.get(reverse('v1:authemail-password-reset-verify'),
                              {'code': 'notacorrectcode'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'], 'Unable to verify user.')

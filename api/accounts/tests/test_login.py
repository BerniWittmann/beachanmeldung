import json

from django.core.urlresolvers import reverse
from django.test import TransactionTestCase
from django.utils.timezone import now
from django.utils.translation import activate
from rest_framework.test import APIClient

from api.accounts.models import MyUser

activate('en-us')

token_regex = '^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$'


class LoginTestCase(TransactionTestCase):
    def setUp(self):
        user = MyUser.objects.create(email='test@byom.de', first_name='Test', last_name='User', phone='+49192481024')
        user.set_password('test123')
        user.is_verified = True
        user.save()

    def test_login_valid(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-login'),
                               {'email': 'test@byom.de',
                                'password': 'test123'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertIsNotNone(data['token'])

    def test_login_password_required(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-login'),
                               {'email': 'test@byom.de'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['password'], ['This field is required.'])

    def test_login_email_required(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-login'),
                               {'password': 'test123'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['email'], ['This field is required.'])

    def test_login_email_invalid(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-login'),
                               {'email': 'not_an-E?mail',
                                'password': 'test123'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['email'], ['Enter a valid email address.'])

    def test_login_invalid(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-login'),
                               {'email': 'test@byom.de',
                                'password': 'just_wrong'})
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'],
                         'Unable to login with provided credentials.')

    def test_login_unverified_user(self):
        user = MyUser.objects.first()
        user.is_verified = False
        user.save()

        client = APIClient()
        response = client.post(reverse('v1:authemail-login'),
                               {'email': 'test@byom.de',
                                'password': 'test123'})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertIsNotNone(data['token'])
        self.assertRegexpMatches(data['token'], token_regex)

    def test_login_inactive_user(self):
        user = MyUser.objects.first()
        user.is_active = False
        user.save()

        client = APIClient()
        response = client.post(reverse('v1:authemail-login'),
                               {'email': 'test@byom.de',
                                'password': 'test123'})
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.content.decode('utf-8'))
        self.assertIn(data['detail'],
                      ['User account not active.',
                       'Unable to login with provided credentials.'])

    def test_login_set_last_login(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-login'),
                               {'email': 'test@byom.de',
                                'password': 'test123'})
        self.assertEqual(response.status_code, 200)
        user = MyUser.objects.first()
        self.assertAlmostEqual((user.last_login - now()).total_seconds(), 0, 1)

import json

from authemail.models import SignupCode
from django.core import mail
from django.core.urlresolvers import reverse
from django.test import TransactionTestCase
from django.utils.translation import activate
from rest_framework.test import APIClient

from api.accounts.models import MyUser

activate('en-us')


class SignupTestCase(TransactionTestCase):
    def test_signup_valid(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-signup'),
                               {'email': 'test@byom.de',
                                'password': 'test123',
                                'first_name': 'Test',
                                'last_name': 'User',
                                'phone': '+49192481024'})
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['email'], 'test@byom.de')
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], 'User')
        self.assertEqual(data['phone'], '+49192481024')

    def test_signup_email_required(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-signup'),
                               {'password': 'test123',
                                'first_name': 'Test',
                                'last_name': 'User',
                                'phone': '+49192481024'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['email'], ['This field is required.'])

    def test_signup_password_required(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-signup'),
                               {'email': 'test@byom.de',
                                'first_name': 'Test',
                                'last_name': 'User',
                                'phone': '+49192481024'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['password'], ['This field is required.'])

    def test_signup_phone_required(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-signup'),
                               {'email': 'test@byom.de',
                                'first_name': 'Test',
                                'last_name': 'User',
                                'password': 'test123'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['phone'], ['This field is required.'])

    def test_signup_phone_invalid(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-signup'),
                               {'email': 'test@byom.de',
                                'first_name': 'Test',
                                'last_name': 'User',
                                'password': 'test123',
                                'phone': 'abciaj'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['phone'], ['Phone Number is not valid'])

    def test_signup_first_name_optional(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-signup'),
                               {'email': 'test@byom.de',
                                'last_name': 'User',
                                'password': 'test123',
                                'phone': '+49192481024'})
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['email'], 'test@byom.de')
        self.assertEqual(data['first_name'], '')
        self.assertEqual(data['last_name'], 'User')

    def test_signup_last_name_optional(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-signup'),
                               {'email': 'test@byom.de',
                                'first_name': 'Test',
                                'password': 'test123',
                                'phone': '+49192481024'})
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['email'], 'test@byom.de')
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], '')

    def test_signup_only_email_and_password(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-signup'),
                               {'email': 'test@byom.de',
                                'password': 'test123',
                                'phone': '+49192481024'})
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['email'], 'test@byom.de')
        self.assertEqual(data['first_name'], '')
        self.assertEqual(data['last_name'], '')

    def test_signup_code_created(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-signup'),
                               {'email': 'test@byom.de',
                                'password': 'test123',
                                'first_name': 'Test',
                                'last_name': 'User',
                                'phone': '+49192481024'})
        self.assertEqual(response.status_code, 201)
        user_id = MyUser.objects.first().id
        signup_code = SignupCode.objects.filter(user=user_id)
        self.assertEqual(len(signup_code), 1)
        self.assertIsNotNone(signup_code.first().code)

    def test_signup_code_count_max_one(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-signup'),
                               {'email': 'test@byom.de',
                                'password': 'test123',
                                'first_name': 'Test',
                                'last_name': 'User',
                                'phone': '+49192481024'})
        self.assertEqual(response.status_code, 201)
        response = client.post(reverse('v1:authemail-signup'),
                               {'email': 'test@byom.de',
                                'password': 'test123',
                                'first_name': 'Test',
                                'last_name': 'User',
                                'phone': '+49192481024'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(SignupCode.objects.count(), 1)

    def test_signup_email_sent(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-signup'),
                               {'email': 'test@byom.de',
                                'password': 'test123',
                                'first_name': 'Test',
                                'last_name': 'User',
                                'phone': '+49192481024'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Verify your email address')

from django.test import TransactionTestCase
from api.accounts.models import MyUser
from rest_framework.test import APIClient
from django.core.urlresolvers import reverse
from django.core import mail
import json
from rest_framework_jwt.settings import api_settings

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

token_regex = '^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$'


class AccountMeTestCase(TransactionTestCase):
    token = None

    def setUp(self):
        user = MyUser.objects.create(email='test@byom.de', first_name='Test', last_name='User', phone='+49192481024')
        user.set_password('test123')
        user.is_verified = True
        user.save()
        payload = jwt_payload_handler(user)
        self.token = jwt_encode_handler(payload)

    def test_account_me_valid(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:authemail-me'))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['email'], 'test@byom.de')
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], 'User')
        self.assertFalse(data['is_staff'])
        self.assertIsNotNone(data['phone'])

    def test_account_me_unauthorized(self):
        client = APIClient()
        response = client.get(reverse('v1:authemail-me'))
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'],
                         'Authentication credentials were not provided.')

    def test_account_me_invalid_token(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT absolute_invalid_token')
        response = client.get(reverse('v1:authemail-me'))
        self.assertEqual(response.status_code, 401)

    def test_account_me_staff(self):
        user = MyUser.objects.first()
        user.is_staff = True
        user.save()

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:authemail-me'))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['email'], 'test@byom.de')
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], 'User')
        self.assertTrue(data['is_staff'])
        self.assertIsNotNone(data['phone'])

    def test_account_me_update_missing_data(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:authemail-me'), {
            'first_name': 'New'
        })
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['email'], ['This field is required.'])
        self.assertEqual(data['phone'], ['This field is required.'])

    def test_account_me_update_first_name(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:authemail-me'), {
            'email': 'test@byom.de',
            'first_name': 'New',
            'last_name': 'User',
            'phone': '+49192481024',
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))['user']
        self.assertEqual(data['email'], 'test@byom.de')
        self.assertEqual(data['first_name'], 'New')
        self.assertEqual(data['last_name'], 'User')

        user = MyUser.objects.first()
        self.assertEqual(user.email, 'test@byom.de')
        self.assertEqual(user.first_name, 'New')
        self.assertEqual(user.last_name, 'User')

    def test_account_me_update_last_name(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:authemail-me'), {
            'email': 'test@byom.de',
            'first_name': 'Test',
            'last_name': 'New',
            'phone': '+49192481024',
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))['user']
        self.assertEqual(data['email'], 'test@byom.de')
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], 'New')

        user = MyUser.objects.first()
        self.assertEqual(user.email, 'test@byom.de')
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.last_name, 'New')

    def test_account_me_update_phone(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:authemail-me'), {
            'email': 'test@byom.de',
            'first_name': 'Test',
            'last_name': 'New',
            'phone': '+49123456789',
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))['user']
        self.assertEqual(data['email'], 'test@byom.de')
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], 'New')
        self.assertEqual(data['phone'], '+49123456789')

        user = MyUser.objects.first()
        self.assertEqual(user.email, 'test@byom.de')
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.last_name, 'New')
        self.assertEqual(user.phone, '+49123456789')

    def test_account_me_update_phone_invalid(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:authemail-me'), {
            'email': 'test@byom.de',
            'first_name': 'Test',
            'last_name': 'New',
            'phone': 'invalid_phone_number',
        })
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['phone'], ["Phone number must be entered in the format: "
                                         "'+999999999'. Up to 15 digits allowed.",
                                         "Ensure this field has no more than 17 characters."])

        user = MyUser.objects.first()
        self.assertEqual(user.phone, '+49192481024')

    def test_account_me_update_email(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:authemail-me'), {
            'email': 'new@byom.de',
            'first_name': 'Test',
            'last_name': 'User',
            'phone': '+49192481024',
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))['user']
        self.assertEqual(data['email'], 'new@byom.de')
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], 'User')
        self.assertFalse(data['is_verified'])

        user = MyUser.objects.first()
        self.assertEqual(user.email, 'new@byom.de')
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.last_name, 'User')
        self.assertFalse(user.is_verified)

    def test_account_me_update_email_send_mail(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:authemail-me'), {
            'email': 'new@byom.de',
            'first_name': 'Test',
            'last_name': 'User',
            'phone': '+49192481024',
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Verify your email address')

    def test_account_me_update_email_respond_token(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:authemail-me'), {
            'email': 'new@byom.de',
            'first_name': 'Test',
            'last_name': 'User',
            'phone': '+49192481024',
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertIsNotNone(data['token'])
        self.assertRegexpMatches(data['token'], token_regex)

    def test_account_me_update_all(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:authemail-me'), {
            'email': 'new@byom.de',
            'first_name': 'New',
            'last_name': 'Name',
            'phone': '+49123456789',
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))['user']
        self.assertEqual(data['email'], 'new@byom.de')
        self.assertEqual(data['first_name'], 'New')
        self.assertEqual(data['last_name'], 'Name')
        self.assertEqual(data['phone'], '+49123456789')

        user = MyUser.objects.first()
        self.assertEqual(user.email, 'new@byom.de')
        self.assertEqual(user.first_name, 'New')
        self.assertEqual(user.last_name, 'Name')

    def test_account_me_update_prevent_is_staff(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:authemail-me'), {
            'email': 'test@byom.de',
            'first_name': 'Test',
            'last_name': 'User',
            'is_staff': True,
            'phone': '+49192481024',
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))['user']
        self.assertFalse(data['is_staff'])

        user = MyUser.objects.first()
        self.assertFalse(user.is_staff)

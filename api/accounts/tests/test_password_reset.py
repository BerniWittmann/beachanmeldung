from django.test import TransactionTestCase
from api.accounts.models import MyUser
from rest_framework.test import APIClient
from django.core.urlresolvers import reverse
from django.core import mail
from authemail.models import PasswordResetCode
import json


class PasswordResetTestCase(TransactionTestCase):
    user = None

    def setUp(self):
        self.user = MyUser.objects.create(email='test@byom.de',
                                          first_name='Test',
                                          last_name='User',
                                          phone='+49192481024')
        self.user.set_password('test123')
        self.user.is_verified = True
        self.user.save()

    def test_reset_password_valid(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-password-reset'),
                               {'email': 'test@byom.de'})
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['email'], 'test@byom.de')

    def test_reset_password_unkown_email(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-password-reset'),
                               {'email': 'some_strange@email.com'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'], 'Password reset not allowed.')

    def test_reset_password_unverified(self):
        self.user.is_verified = False
        self.user.save()

        client = APIClient()
        response = client.post(reverse('v1:authemail-password-reset'),
                               {'email': 'test@byom.de'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'], 'Password reset not allowed.')

    def test_reset_password_code(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-password-reset'),
                               {'email': 'test@byom.de'})
        self.assertEqual(response.status_code, 201)
        reset_code = PasswordResetCode.objects.first()
        self.assertIsNotNone(reset_code)

    def test_reset_password_code_max_count_one(self):
        code_before = PasswordResetCode.objects.create_reset_code(self.user)\
            .code.decode('utf-8')
        self.assertEqual(PasswordResetCode.objects.count(), 1)

        client = APIClient()
        response = client.post(reverse('v1:authemail-password-reset'),
                               {'email': 'test@byom.de'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(PasswordResetCode.objects.count(), 1)
        self.assertNotEqual(PasswordResetCode.objects.first().code,
                            code_before)

    def test_reset_password_code_dont_delete_other_users_codes(self):
        other_user = MyUser.objects.create(email='other-test@byom.de',
                                           first_name='Other',
                                           last_name='User',
                                           phone='+49192481024')
        other_user.set_password('test123')
        other_user.is_verified = True
        other_user.save()
        other_user_code = PasswordResetCode.objects\
            .create_reset_code(other_user).code.decode('utf-8')
        PasswordResetCode.objects.create_reset_code(self.user)

        client = APIClient()
        response = client.post(reverse('v1:authemail-password-reset'),
                               {'email': 'test@byom.de'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(PasswordResetCode.objects.count(), 2)
        self.assertEqual(PasswordResetCode.objects.filter(user=self.user)
                         .count(), 1)
        self.assertEqual(PasswordResetCode.objects.filter(user=other_user)
                         .count(), 1)
        self.assertEqual(PasswordResetCode.objects.filter(user=other_user)
                         .first().code, other_user_code)

    def test_reset_password_email_sent(self):
        client = APIClient()
        response = client.post(reverse('v1:authemail-password-reset'),
                               {'email': 'test@byom.de'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Reset Your Password')

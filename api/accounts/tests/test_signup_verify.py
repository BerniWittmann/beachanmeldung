from django.test import TestCase
from api.accounts.models import MyUser
from rest_framework.test import APIClient
from django.core.urlresolvers import reverse
import json
from authemail.models import SignupCode


class SignupVerifyTestCase(TestCase):
    user_id = None
    user = None
    signup_code = None

    def setUp(self):
        self.user = MyUser.objects.create(email='test@byom.de',
                                          first_name='Test',
                                          last_name='User')
        self.user.set_password('test123')
        self.user.save()
        self.user_id = self.user.id
        self.signup_code = SignupCode.objects\
            .create_signup_code(user=self.user, ipaddr='127.0.0.1')\
            .code.decode('utf-8')

    def test_signup_code_verify_valid(self):
        client = APIClient()
        response = client.get(reverse('v1:authemail-signup-verify'),
                              {'code': self.signup_code})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['success'], 'User verified.')

    def test_signup_code_verify_empty(self):
        client = APIClient()
        response = client.get(reverse('v1:authemail-signup-verify'))
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'], 'Unable to verify user.')

    def test_signup_code_verify_invalid(self):
        client = APIClient()
        response = client.get(reverse('v1:authemail-signup-verify'),
                              {'code': 'totallywrong'})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'], 'Unable to verify user.')

    def test_signup_code_verify_remove_code(self):
        client = APIClient()
        response = client.get(reverse('v1:authemail-signup-verify'),
                              {'code': self.signup_code})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(SignupCode.objects.count(), 0)

    def test_signup_code_verify_remove_all_codes(self):
        SignupCode.objects.create_signup_code(user=self.user,
                                              ipaddr='127.0.0.1')
        self.assertEqual(SignupCode.objects.count(), 2)
        client = APIClient()
        response = client.get(reverse('v1:authemail-signup-verify'),
                              {'code': self.signup_code})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(SignupCode.objects.count(), 0)

    def test_reset_password_code_dont_delete_other_users_codes(self):
        other_user = MyUser.objects.create(email='other-test@byom.de',
                                           first_name='Other',
                                           last_name='User')
        other_user.set_password('test123')
        other_user.is_verified = True
        other_user.save()
        other_user_code = SignupCode.objects\
            .create_signup_code(user=other_user, ipaddr='127.0.0.1')\
            .code.decode('utf-8')
        self.signup_code = SignupCode.objects\
            .create_signup_code(user=self.user, ipaddr='127.0.0.1')\
            .code.decode('utf-8')

        client = APIClient()
        response = client.get(reverse('v1:authemail-signup-verify'),
                              {'code': self.signup_code})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(SignupCode.objects.count(), 1)
        self.assertEqual(SignupCode.objects.filter(user=self.user)
                         .count(), 0)
        self.assertEqual(SignupCode.objects.filter(user=other_user)
                         .count(), 1)
        self.assertEqual(SignupCode.objects.filter(user=other_user)
                         .first().code, other_user_code)

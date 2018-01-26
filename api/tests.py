import json

from constance.test import override_config
from django.core.urlresolvers import reverse
from django.test import TestCase
from django.utils.timezone import now
from django.utils.translation import activate
from rest_framework.test import APIClient
from rest_framework_jwt.settings import api_settings

from api.accounts.models import MyUser

activate('en-us')

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class SetLastLoginMiddlewareTestCase(TestCase):
    user = None
    token = None

    def setUp(self):
        self.user = MyUser.objects.create(email='test@byom.de',
                                          first_name='Test',
                                          last_name='User',
                                          phone='+49192481024')
        self.user.set_password('test123')
        self.user.is_verified = True
        self.user.save()
        payload = jwt_payload_handler(self.user)
        self.token = jwt_encode_handler(payload)

    def test_set_last_login(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:authemail-me'))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(MyUser.objects.first().last_login)
        self.assertAlmostEqual((MyUser.objects.first().last_login - now())
                               .total_seconds(), 0, 1)

    def test_not_set_last_login_without_user(self):
        client = APIClient()
        response = client.get(reverse('v1:authemail-me'))
        self.assertEqual(response.status_code, 401)
        self.assertIsNone(self.user.last_login)


@override_config(YEAR=2017)
@override_config(WELCOME_TEXT='Welcome')
@override_config(TERMS_OF_PARTICIPATION='Terms of Participation')
class ConfigViewTestCase(TestCase):

    def test_get_config(self):
        client = APIClient()
        response = client.get(reverse('v1:config'))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data.get('year'), 2017)
        self.assertEqual(data.get('welcome_text'), 'Welcome')
        self.assertEqual(data.get('terms_of_participation'), 'Terms of Participation')

    def test_other_method(self):
        client = APIClient()
        for method in ['post', 'put', 'patch', 'delete']:
            response = getattr(client, method)(reverse('v1:config'))
            self.assertEqual(response.status_code, 405)

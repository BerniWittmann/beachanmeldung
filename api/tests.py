from django.test import TestCase
from rest_framework.test import APIClient
from api.accounts.models import MyUser
from django.core.urlresolvers import reverse
from django.utils.timezone import now
from rest_framework_jwt.settings import api_settings

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class SetLastLoginMiddlewareTestCase(TestCase):
    user = None
    token = None

    def setUp(self):
        self.user = MyUser.objects.create(email='test@byom.de',
                                          first_name='Test',
                                          last_name='User')
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
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(self.user.last_login)

import datetime
import json

from django.core.urlresolvers import reverse
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework_jwt.settings import api_settings

from api.accounts.models import MyUser
from api.tournaments.models import Tournament

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

token_regex = '^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$'


class Tournaments(TestCase):
    token = None
    tournament = None

    def setUp(self):
        user = MyUser.objects.create(email='test@byom.de', first_name='Test', last_name='User', phone='+49192481024')
        user.set_password('test123')
        user.is_verified = True
        user.is_staff = True
        user.save()
        payload = jwt_payload_handler(user)
        self.token = jwt_encode_handler(payload)

        self.tournament = Tournament.objects \
            .create(name='Test Turnier',
                    gender='mixed',
                    start_date='2017-01-01',
                    end_date='2017-01-02',
                    deadline_signup='2017-01-01T00:00:00Z',
                    deadline_edit='2017-01-01T00:00:00Z',
                    advertisement_url='http://www.google.de',
                    contact_email='test@byom.de',
                    starting_fee=60.0,
                    number_of_places=12
                    )

    def test_tournament_list_get(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:tournament-list'))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], 'Test Turnier')
        self.assertGreaterEqual(data[0]['id'], 1)

    def test_tournament_list_get_signup_flags(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:tournament-list'))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(len(data), 1)
        self.assertFalse(data[0]['signup_open'])
        self.assertFalse(data[0]['is_before_signup'])
        self.assertTrue(data[0]['is_after_signup'])

    def test_tournament_list_get_unauthorized(self):
        client = APIClient()
        response = client.get(reverse('v1:tournament-list'))
        self.assertNotEqual(response.status_code, 401)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], 'Test Turnier')

    def test_tournament_list_get_invalid_token(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT absolute_invalid_token')
        response = client.get(reverse('v1:tournament-list'))
        self.assertEqual(response.status_code, 401)

    def test_tournament_create(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:tournament-list'), {
            'name': 'New Turnier',
            'gender': 'female',
            'start_date': '2017-01-02',
            'end_date': '2017-01-02',
            'deadline_signup': '2100-01-01T00:00:00Z',
            'deadline_edit': '2017-01-01T00:00:00Z',
            'advertisement_url': 'http://www.google.de',
            'contact_email': 'test@byom.de',
            'starting_fee': 60.0,
            'number_of_places': 12
        })
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content.decode('utf-8'))
        self.assertGreater(data['id'], 1)
        self.assertEqual(data['name'], 'New Turnier')
        self.assertTrue(data['signup_open'])

        self.assertEqual(Tournament.objects.all().count(), 2)
        self.assertGreater(Tournament.objects.last().id, 1)
        self.assertEqual(Tournament.objects.last().name, 'New Turnier')
        self.assertIsNotNone(Tournament.objects.last().start_signup)

    def test_tournament_missing_parameter(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:tournament-list'), {})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['name'], ['This field is required.'])
        self.assertEqual(data['start_date'], ['This field is required.'])
        self.assertEqual(data['end_date'], ['This field is required.'])
        self.assertEqual(data['deadline_signup'], ['This field is required.'])
        self.assertEqual(data['deadline_edit'], ['This field is required.'])

    def test_tournament_create_invalid_start_end_date(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:tournament-list'), {
            'name': 'New Turnier',
            'gender': 'female',
            'start_date': '2017-01-06',
            'end_date': '2017-01-02',
            'deadline_signup': '2017-01-01T00:00:00Z',
            'deadline_edit': '2017-01-01T00:00:00Z',
            'advertisement_url': 'http://www.google.de',
            'contact_email': 'test@byom.de',
            'starting_fee': 60.0,
            'number_of_places': 12
        })
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['non_field_errors'],
                         ['StartDate must be before EndDate'])

    def test_tournament_create_invalid_start_deadline_signup(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:tournament-list'), {
            'name': 'New Turnier',
            'gender': 'female',
            'start_date': '2017-01-01',
            'end_date': '2017-01-02',
            'deadline_signup': '2017-01-01T00:00:00Z',
            'start_signup': '2017-01-02T00:00:00Z',
            'deadline_edit': '2017-01-01T00:00:00Z',
            'advertisement_url': 'http://www.google.de',
            'contact_email': 'test@byom.de',
            'starting_fee': 60.0,
            'number_of_places': 12
        })
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['non_field_errors'],
                         ['Deadline of Signup must be after Start of Signup'])

    def test_tournament_get(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:tournament-detail',
                                      kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['name'], 'Test Turnier')
        self.assertGreaterEqual(data['id'], 1)

    def test_tournament_get_unkown(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:tournament-detail',
                                      kwargs={'pk': 9999999999}))
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'], 'Not found.')

    def test_tournament_get_signup_flags(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:tournament-detail',
                                      kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertFalse(data['signup_open'])
        self.assertFalse(data['is_before_signup'])
        self.assertTrue(data['is_after_signup'])

    def test_tournament_put(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:tournament-detail',
                                      kwargs={'pk': self.tournament.id}), {
            'name': 'New Name',
            'gender': 'female',
            'start_date': '2017-01-01',
            'end_date': '2017-01-02',
            'deadline_signup': '2017-01-01T00:00:00Z',
            'start_signup': '2016-01-01T00:00:00Z',
            'deadline_edit': '2017-01-01T00:00:00Z',
            'advertisement_url': 'http://www.google.de',
            'contact_email': 'test@byom.de',
            'starting_fee': 60.0,
            'number_of_places': 12
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['name'], 'New Name')
        self.assertEqual(Tournament.objects.first().name, 'New Name')

    def test_tournament_put_invalid_start_end_date(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:tournament-detail',
                                      kwargs={'pk': self.tournament.id}), {
            'name': 'New Turnier',
            'gender': 'female',
            'start_date': '2017-01-06',
            'end_date': '2017-01-02',
            'deadline_signup': '2017-01-01T00:00:00Z',
            'deadline_edit': '2017-01-01T00:00:00Z',
            'advertisement_url': 'http://www.google.de',
            'contact_email': 'test@byom.de',
            'starting_fee': 60.0,
            'number_of_places': 12
        })
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['non_field_errors'],
                         ['StartDate must be before EndDate'])

    def test_tournament_put_invalid_start_deadline_signup(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:tournament-detail',
                                      kwargs={'pk': self.tournament.id}), {
            'name': 'New Turnier',
            'gender': 'female',
            'start_date': '2017-01-01',
            'end_date': '2017-01-02',
            'deadline_signup': '2017-01-01T00:00:00Z',
            'start_signup': '2017-01-02T00:00:00Z',
            'deadline_edit': '2017-01-01T00:00:00Z',
            'advertisement_url': 'http://www.google.de',
            'contact_email': 'test@byom.de',
            'starting_fee': 60.0,
            'number_of_places': 12
        })
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['non_field_errors'],
                         ['Deadline of Signup must be after Start of Signup'])

    def test_tournament_delete(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.delete(reverse('v1:tournament-detail',
                                         kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Tournament.objects.all().count(), 0)

    def test_tournament_signup_open(self):
        self.tournament.deadline_signup = timezone.now() + \
                                          datetime.timedelta(days=1)
        self.tournament.start_signup = timezone.now() - \
            datetime.timedelta(days=1)
        self.tournament.save()

        self.assertTrue(self.tournament.signup_open())

        self.tournament.deadline_signup = timezone.now() + \
            datetime.timedelta(days=2)
        self.tournament.start_signup = timezone.now() + \
            datetime.timedelta(days=1)
        self.tournament.save()

        self.assertFalse(self.tournament.signup_open())

        self.tournament.deadline_signup = timezone.now() - \
            datetime.timedelta(days=1)
        self.tournament.start_signup = timezone.now() - \
            datetime.timedelta(days=2)
        self.tournament.save()

        self.assertFalse(self.tournament.signup_open())

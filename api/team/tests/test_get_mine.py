import json

from django.core.urlresolvers import reverse
from django.test import TestCase
from django.utils.translation import activate
from rest_framework.test import APIClient
from rest_framework_jwt.settings import api_settings

from api.accounts.models import MyUser
from api.team.models import Team
from api.tournaments.models import Tournament

activate('en-us')

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

token_regex = '^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$'


class Teams(TestCase):
    token = None
    tournament = None
    team = None
    user = None

    def setUp(self):
        self.user = MyUser.objects.create(email='test@byom.de',
                                          first_name='Test',
                                          last_name='User',
                                          phone='+49192481024')
        self.user.set_password('test123')
        self.user.is_verified = True
        self.user.is_staff = True
        self.user.save()

        other_user = MyUser.objects.create(email='test2@byom.de',
                                           first_name='Test',
                                           last_name='Other',
                                           phone='+49192481024')
        other_user.set_password('test123')
        other_user.is_verified = True
        other_user.save()
        payload = jwt_payload_handler(self.user)
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
        self.team = Team.objects.create(
            name='TSV Ismaning',
            beachname='THC Eh Drin!',
            tournament=self.tournament,
            trainer=self.user,
        )
        self.other_team = Team.objects.create(
            name='Antoher Team',
            beachname='By Me',
            tournament=self.tournament,
            trainer=self.user,
        )
        Team.objects.create(
            name='Other Team',
            beachname='Lame Name',
            tournament=self.tournament,
            trainer=other_user,
        )

    def test_team_list_get(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:team-get-by-user'))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(len(data), 2)
        self.assertEqual(data[1]['name'], 'TSV Ismaning')
        self.assertGreaterEqual(data[1]['id'], 1)
        self.assertEqual(data[0]['name'], 'Antoher Team')
        self.assertGreaterEqual(data[0]['id'], 1)

    def test_team_list_get_unauthorized(self):
        client = APIClient()
        response = client.get(reverse('v1:team-get-by-user'))
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data, {'detail': 'Authentication credentials were not provided.'})

    def test_team_list_get_invalid_token(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT absolute_invalid_token')
        response = client.get(reverse('v1:team-get-by-user'))
        self.assertEqual(response.status_code, 401)

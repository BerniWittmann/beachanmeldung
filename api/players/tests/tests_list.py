import json

from django.core.urlresolvers import reverse
from django.test import TestCase
from django.utils.translation import activate
from rest_framework.test import APIClient
from rest_framework_jwt.settings import api_settings

from api.accounts.models import MyUser
from api.enums import TeamStateTypes
from api.players.models import Player
from api.team.models import Team
from api.tournaments.models import Tournament

activate('en-us')

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

token_regex = '^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$'


class Players(TestCase):
    user = None
    token = None
    tournament = None
    team = None
    player = None

    def setUp(self):
        self.user = MyUser.objects.create(email='test@byom.de',
                                          first_name='Test',
                                          last_name='User',
                                          phone='+49192481024')
        self.user.set_password('test123')
        self.user.is_verified = True
        self.user.is_staff = True
        self.user.save()
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
        self.team = Team.objects \
            .create(
                name='TSV Ismaning',
                beachname='THC Eh Drin!',
                tournament=self.tournament,
                trainer=self.user,
            )

        self.player = Player.objects \
            .create(
                first_name='Test',
                last_name='Player',
                number=12,
                year_of_birth=1990,
                team=self.team,
            )

    def test_player_list_get(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:player-list'))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['name'], 'Test Player')
        self.assertGreaterEqual(data[0]['id'], 1)

    def test_player_list_get_unauthorized(self):
        client = APIClient()
        response = client.get(reverse('v1:player-list'))
        self.assertEqual(response.status_code, 401)

    def test_player_list_get_invalid_token(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT absolute_invalid_token')
        response = client.get(reverse('v1:player-list'))
        self.assertEqual(response.status_code, 401)

    def test_player_list_get_no_admin(self):
        self.user.is_staff = False
        self.user.save()
        payload = jwt_payload_handler(self.user)
        self.token = jwt_encode_handler(payload)

        client = APIClient()
        response = client.get(reverse('v1:player-list'))
        self.assertEqual(response.status_code, 401)

    def test_player_list_other_methods(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:player-list'))
        self.assertEqual(response.status_code, 405)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:player-list'))
        self.assertEqual(response.status_code, 405)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.delete(reverse('v1:player-list'))
        self.assertEqual(response.status_code, 405)

    def test_player_get(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:player-detail',
                                      kwargs={'pk': self.player.id}))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['name'], 'Test Player')
        self.assertGreaterEqual(data['id'], 1)

    def test_player_get_unkown(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:player-detail',
                                      kwargs={'pk': 9999999999}))
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'], 'Not found.')

    def test_player_get_disabled_team(self):
        self.team.state = TeamStateTypes.denied
        self.team.save()

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:player-detail',
                                      kwargs={'pk': self.player.id}))
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['detail'], 'Not found.')

    def test_player_get_other_methods(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:player-detail',
                                       kwargs={'pk': self.player.id}))
        self.assertEqual(response.status_code, 405)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:player-detail',
                                      kwargs={'pk': self.player.id}))
        self.assertEqual(response.status_code, 405)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.delete(reverse('v1:player-detail',
                                         kwargs={'pk': self.player.id}))
        self.assertEqual(response.status_code, 405)

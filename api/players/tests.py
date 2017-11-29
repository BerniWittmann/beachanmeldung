import json

from django.core.urlresolvers import reverse
from django.test import TransactionTestCase
from rest_framework.test import APIClient
from rest_framework_jwt.settings import api_settings

from api.accounts.models import MyUser
from api.players.models import Player
from api.team.models import Team
from api.tournaments.models import Tournament

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

token_regex = '^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$'


class Players(TransactionTestCase):
    token = None
    tournament = None
    team = None
    user = None
    first_player = None
    second_player = None
    other_user_token = None

    def setUp(self):
        self.user = MyUser.objects.create_user(email='test@byom.de', first_name='Test', last_name='User')
        self.user.set_password('test123')
        self.user.is_verified = True
        self.user.is_staff = True
        self.user.save()
        payload = jwt_payload_handler(self.user)
        self.token = jwt_encode_handler(payload)

        other_user = MyUser.objects.create_user(email='test2@byom.de', first_name='Other', last_name='User')
        other_user.set_password('test123')
        other_user.is_verified = True
        other_user.save()
        payload = jwt_payload_handler(other_user)
        self.other_user_token = jwt_encode_handler(payload)

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
        self.first_player = Player.objects.create(
            first_name='First',
            last_name='Player',
            number=42,
            year_of_birth=1990,
            team=self.team
        )
        self.second_player = Player.objects.create(
            first_name='Other',
            last_name='Player',
            number=43,
            year_of_birth=1991,
            team=self.team
        )

    def test_team_get_players(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertIsNotNone(data['players'])
        players = data['players']
        self.assertNotEqual(players, [])
        self.assertEqual(players[0]['name'], 'First Player')
        self.assertEqual(players[1]['name'], 'Other Player')

    def test_team_get_players_public(self):
        client = APIClient()
        response = client.get(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertIsNotNone(data['players'])
        players = data['players']
        self.assertEqual(players, [])

    def test_team_get_players_other_user(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.other_user_token)
        response = client.get(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}))
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertIsNotNone(data['players'])
        players = data['players']
        self.assertEqual(players, [])

    def test_team_update_no_players(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), {
                                  'name': 'TSV Ismaning',
                                  'beachname': 'THC Eh Drin!',
                                  'players': [],
                              })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(data['players'])
        players = data['players']
        self.assertEqual(players, [])
        self.assertEqual(Player.objects.count(), 0)

    def test_team_update_players(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        data = {
            'name': 'TSV Ismaning',
            'beachname': 'THC Eh Drin!',
            'players': [{
                'id': self.first_player.id,
                'first_name': 'New',
                'last_name': 'Player',
                'number': 42,
                'year_of_birth': 1990
            }, {
                'id': self.second_player.id,
                'first_name': 'Another',
                'last_name': 'Name',
                'number': 43,
                'year_of_birth': 1990
            }],
        }
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), json.dumps(data), content_type='application/json')
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(data['players'])
        players = data['players']
        self.assertNotEqual(players, [])
        self.assertEqual(players[0]['name'], 'New Player')
        self.assertEqual(players[1]['name'], 'Another Name')
        players = Player.objects.all()
        self.assertNotEqual(players, [])
        self.assertEqual(players[0].name(), 'New Player')
        self.assertEqual(players[1].name(), 'Another Name')
        self.assertEqual(Player.objects.count(), 2)

    def test_team_update_add_players(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        data = {
            'name': 'TSV Ismaning',
            'beachname': 'THC Eh Drin!',
            'players': [{
                'id': self.first_player.id,
                'first_name': 'New',
                'last_name': 'Player',
                'number': 42,
                'year_of_birth': 1990
            }, {
                'id': self.second_player.id,
                'first_name': 'Another',
                'last_name': 'Name',
                'number': 43,
                'year_of_birth': 1990
            }, {
                'first_name': 'Very',
                'last_name': 'New',
                'number': 44,
                'year_of_birth': 1990
            }],
        }
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), json.dumps(data), content_type='application/json')
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(data['players'])
        players = data['players']
        self.assertNotEqual(players, [])
        self.assertEqual(players[2]['name'], 'Very New')
        players = Player.objects.all()
        self.assertNotEqual(players, [])
        self.assertEqual(players[2].name(), 'Very New')
        self.assertEqual(Player.objects.count(), 3)

    def test_team_update_players_not_unique(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        data = {
            'name': 'TSV Ismaning',
            'beachname': 'THC Eh Drin!',
            'players': [{
                'id': self.first_player.id,
                'first_name': 'New',
                'last_name': 'Player',
                'number': 42,
                'year_of_birth': 1990
            }, {
                'id': self.second_player.id,
                'first_name': 'New',
                'last_name': 'Player',
                'number': 43,
                'year_of_birth': 1990
            }, {
                'first_name': 'Other',
                'last_name': 'Player',
                'number': 41,
                'year_of_birth': 1990
            }],
        }
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), json.dumps(data), content_type='application/json')
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 400)
        self.assertDictEqual(data, {
            'detail': ['Duplicate Player Name'],
            'key': ['duplicate_player_name']
        })
        self.assertEqual(Player.objects.count(), 2)

    def test_team_update_players_same_number(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        data = {
            'name': 'TSV Ismaning',
            'beachname': 'THC Eh Drin!',
            'players': [{
                'id': self.first_player.id,
                'first_name': 'New',
                'last_name': 'Player',
                'number': 42,
                'year_of_birth': 1990
            }, {
                'id': self.second_player.id,
                'first_name': 'New',
                'last_name': 'Another',
                'number': 42,
                'year_of_birth': 1990
            }, {
                'first_name': 'Other',
                'last_name': 'Player',
                'number': 41,
                'year_of_birth': 1990
            }],
        }
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), json.dumps(data), content_type='application/json')
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 400)
        self.assertDictEqual(data, {
            'detail': ['Duplicate Player Number'],
            'key': ['duplicate_player_number']
        })
        self.assertEqual(Player.objects.count(), 2)

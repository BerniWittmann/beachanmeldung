import json

from django.core.urlresolvers import reverse
from django.test import TestCase
from django.utils import timezone
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
        payload = jwt_payload_handler(self.user)
        self.token = jwt_encode_handler(payload)

        self.tournament = Tournament.objects \
            .create(name='Test Turnier',
                    gender='mixed',
                    start_date='2017-01-01',
                    end_date='2017-01-02',
                    start_signup=timezone.now() - timezone.timedelta(days=365),
                    deadline_signup=timezone.now() + timezone.timedelta(days=365),
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

    def test_team_create(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-list'), {
            'name': 'New Team',
            'beachname': 'creative Name',
            'tournament': self.tournament.id,
        })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 201)
        self.assertGreaterEqual(data['id'], 2)
        self.assertEqual(data['name'], 'New Team')

        self.assertEqual(Team.objects.all().count(), 2)
        self.assertGreaterEqual(Team.objects.last().id, 2)
        self.assertEqual(Team.objects.last().name, 'New Team')
        self.assertIsNotNone(Team.objects.last().trainer)
        self.assertIsNotNone(Team.objects.last().tournament)
        self.assertIsNotNone(Team.objects.last().date_signup)

    def test_team_create_invalid_tournament(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-list'), {
            'name': 'Another Team',
            'beachname': 'creative 2 Name',
            'tournament': 999999,
        })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['non_field_errors'], ['Tournament not Found'])

        self.assertEqual(Team.objects.all().count(), 1)

    def test_team_missing_parameter(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-list'), {})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['name'], ['This field may not be null.'])

        self.assertEqual(Team.objects.all().count(), 1)

    def test_team_missing_tournament_id_parameter(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-list'), {
            'name': 'New Name'
        })
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['tournament_id'], ['This field may not be null.'])

        self.assertEqual(Team.objects.all().count(), 1)

    def test_team_optional_parameters(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-list'), {
            'name': 'Another Team',
            'tournament': self.tournament.id
        })
        self.assertEqual(response.status_code, 201)

        self.assertEqual(Team.objects.all().count(), 2)

    def test_team_name_not_unqiue(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-list'), {
            'name': 'TSV Ismaning',
            'beachname': 'THC Eh Drin!',
            'tournament': self.tournament.id
        })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 400)
        self.assertDictEqual(data, {
            'detail': ['Name already taken'],
            'key': ['name_already_taken']
        })

        self.assertEqual(Team.objects.all().count(), 1)

    def test_team_name_not_unqiue_without_beachname(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-list'), {
            'name': 'TSV Ismaning',
            'tournament': self.tournament.id
        })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 400)
        self.assertDictEqual(data, {
            'detail': ['Name already taken'],
            'key': ['name_already_taken']
        })

        self.assertEqual(Team.objects.all().count(), 1)

    def test_team_create_before_signup_start(self):
        self.tournament.start_signup = timezone.now() + timezone.timedelta(days=1)
        self.tournament.save()

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-list'), {
            'name': 'New Team',
            'beachname': 'creative Name',
            'tournament': self.tournament.id,
        })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 400)
        self.assertDictEqual(data, {
            'detail': 'Team Creation not possible before Signup period has started',
            'key': 'before_start_signup'
        })
        self.assertEqual(Team.objects.all().count(), 1)

    def test_team_create_after_deadline_signup(self):
        self.tournament.deadline_signup = timezone.now() - timezone.timedelta(days=1)
        self.tournament.save()

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-list'), {
            'name': 'New Team',
            'beachname': 'creative Name',
            'tournament': self.tournament.id,
        })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 400)
        self.assertDictEqual(data, {
            'detail': 'Team Creation not possible after Signup period has ended',
            'key': 'after_deadline_signup'
        })
        self.assertEqual(Team.objects.all().count(), 1)

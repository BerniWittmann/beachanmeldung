import json

from django.core.urlresolvers import reverse
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework_jwt.settings import api_settings

from api.accounts.models import MyUser
from api.team.models import Team
from api.tournaments.models import Tournament

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

token_regex = '^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$'


class Teams(TestCase):
    token = None
    tournament = None
    team = None
    user = None

    def setUp(self):
        self.user = MyUser.objects.create_user(email='test@byom.de', first_name='Test', last_name='User')
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
        self.team = Team.objects.create(
            name='TSV Ismaning',
            beachname='THC Eh Drin!',
            tournament=self.tournament,
            trainer=self.user,
        )
        self.assertEqual(Team.objects.first().paid, False)

    def test_team_mark_paid(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-mark-paid',
                               kwargs={'pk': self.team.id}))
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['paid'], True)
        self.assertEqual(Team.objects.first().paid, True)

    def test_team_change_state_unauthorized(self):
        client = APIClient()
        response = client.post(reverse('v1:team-mark-paid',
                               kwargs={'pk': self.team.id}),)
        self.assertEqual(response.status_code, 401)

    def test_team_change_state_wrong_method(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:team-mark-paid',
                                      kwargs={'pk': self.team.id}))
        self.assertEqual(response.status_code, 405)

    def test_team_change_state_team_not_found(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-mark-paid',
                                       kwargs={'pk': 99999999999}))
        self.assertEqual(response.status_code, 404)

    def test_team_change_state_not_admin_user(self):
        user = MyUser.objects.create(email='test2@byom.de', first_name='ANother', last_name='User')
        user.set_password('test123')
        user.is_verified = True
        user.is_staff = False
        user.save()
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        response = client.post(reverse('v1:team-mark-paid',
                                       kwargs={'pk': self.team.id}))
        self.assertEqual(response.status_code, 403)
        self.assertEqual(Team.objects.first().paid, False)

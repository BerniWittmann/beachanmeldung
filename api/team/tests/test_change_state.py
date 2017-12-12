import json

from django.core.urlresolvers import reverse
from django.test import TestCase
from django.utils.translation import activate
from rest_framework.test import APIClient
from rest_framework_jwt.settings import api_settings

from api.accounts.models import MyUser
from api.enums import TeamStateTypes
from api.team.models import Team
from api.tournaments.models import Tournament

activate('en-us')

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

token_regex = '^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$'


class TeamTestCase(TestCase):
    token = None
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

    def test_team_change_state_unauthorized(self):
        client = APIClient()
        response = client.post(reverse('v1:team-update-state',
                                       kwargs={'pk': self.team.id}), {
            'state': TeamStateTypes.waiting,
        })
        self.assertEqual(response.status_code, 401)

    def test_team_change_state_wrong_method(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.get(reverse('v1:team-update-state',
                                      kwargs={'pk': self.team.id}), {
            'state': TeamStateTypes.waiting,
        })
        self.assertEqual(response.status_code, 405)

    def test_team_change_state_team_not_found(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-update-state',
                                       kwargs={'pk': 99999999999}), {
                                  'state': TeamStateTypes.waiting,
                              })
        self.assertEqual(response.status_code, 404)

    def test_team_change_state_not_admin_user(self):
        user = MyUser.objects.create(email='test2@byom.de',
                                     first_name='ANother',
                                     last_name='User',
                                     phone='+49192481024')
        user.set_password('test123')
        user.is_verified = True
        user.is_staff = False
        user.save()
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        response = client.post(reverse('v1:team-update-state',
                                       kwargs={'pk': self.team.id}), {
            'state': TeamStateTypes.waiting,
        })
        self.assertEqual(response.status_code, 403)

    def test_team_change_state_invalid_state(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-update-state',
                                       kwargs={'pk': self.team.id}), {
            'state': 'invalid_State',
        })
        self.assertEqual(response.status_code, 400)

    def test_team_change_state_set_same_state(self):
        self.team.state = TeamStateTypes.needs_approval
        self.team.save()

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-update-state',
                                       kwargs={'pk': self.team.id}), {
                                   'state': TeamStateTypes.needs_approval,
                               })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['state'], TeamStateTypes.needs_approval)
        newTeamData = Team.objects.get(pk=self.team.id)
        self.assertEqual(newTeamData.state, TeamStateTypes.needs_approval)

    def test_team_change_state_set_waiting(self):
        self.team.state = TeamStateTypes.needs_approval
        self.team.save()

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-update-state',
                                       kwargs={'pk': self.team.id}), {
                                   'state': TeamStateTypes.waiting,
                               })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['state'], TeamStateTypes.waiting)
        newTeamData = Team.objects.get(pk=self.team.id)
        self.assertEqual(newTeamData.state, TeamStateTypes.waiting)

    def test_team_change_state_set_needs_approval(self):
        self.team.state = TeamStateTypes.waiting
        self.team.save()

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-update-state',
                                       kwargs={'pk': self.team.id}), {
                                   'state': TeamStateTypes.needs_approval,
                               })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['state'], TeamStateTypes.needs_approval)
        newTeamData = Team.objects.get(pk=self.team.id)
        self.assertEqual(newTeamData.state, TeamStateTypes.needs_approval)

    def test_team_change_state_set_signup(self):
        self.team.state = TeamStateTypes.needs_approval
        self.team.save()

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-update-state',
                                       kwargs={'pk': self.team.id}), {
                                   'state': TeamStateTypes.signed_up,
                               })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['state'], TeamStateTypes.signed_up)
        newTeamData = Team.objects.get(pk=self.team.id)
        self.assertEqual(newTeamData.state, TeamStateTypes.signed_up)

    def test_team_change_state_set_denied(self):
        self.team.state = TeamStateTypes.needs_approval
        self.team.save()

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.post(reverse('v1:team-update-state',
                                       kwargs={'pk': self.team.id}), {
                                   'state': TeamStateTypes.denied,
                               })

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(data['state'], TeamStateTypes.denied)
        newTeamData = Team.objects.get(pk=self.team.id)
        self.assertEqual(newTeamData.state, TeamStateTypes.denied)

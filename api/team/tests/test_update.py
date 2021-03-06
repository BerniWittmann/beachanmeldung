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
        self.user = MyUser.objects.create_user(email='test@byom.de',
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
                    deadline_edit=timezone.now() + timezone.timedelta(days=30),
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

    def test_team_update(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), {
                                  'name': 'TSV Ismaning 2',
                                  'beachname': 'New Name Name',
                              })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['beachname'], 'New Name Name')
        self.assertEqual(Team.objects.first().beachname, 'New Name Name')
        self.assertEqual(data['name'], 'TSV Ismaning 2')
        self.assertEqual(Team.objects.first().name, 'TSV Ismaning 2')

    def test_team_update_as_other_trainer(self):
        other_user = MyUser.objects.create_user(email='newuser@byom.de',
                                                first_name='Another',
                                                last_name='User',
                                                phone='+49192481024')
        other_user.set_password('test123')
        other_user.is_verified = True
        other_user.is_staff = False
        other_user.save()
        other_payload = jwt_payload_handler(other_user)
        other_token = jwt_encode_handler(other_payload)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + other_token)
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), {
                                  'beachname': 'Bad Name',
                                  'name': 'TSV Ismaning',
                              })
        self.assertEqual(response.status_code, 403)

    def test_team_update_not_update_tournament(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), {
                                  'beachname': 'THC Eh Drin!',
                                  'name': 'TSV Ismaning',
                                  'tournament': 3,
                              })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['tournament']['id'], self.tournament.id)
        self.assertEqual(Team.objects.first().tournament, self.tournament)

    def test_team_update_not_update_trainer(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), {
                                  'beachname': 'THC Eh Drin!',
                                  'name': 'TSV Ismaning',
                                  'trainer': 'hacker@dumb.com',
                              })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Team.objects.first().trainer, self.user)

    def test_team_update_not_update_paid(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), {
                                  'beachname': 'THC Eh Drin!',
                                  'name': 'TSV Ismaning',
                                  'paid': True,
                              })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Team.objects.first().paid, False)

    def test_team_update_not_update_state(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), {
                                  'beachname': 'THC Eh Drin!',
                                  'name': 'TSV Ismaning',
                                  'state': 'signed up',
                              })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Team.objects.first().state, 'needs approval')

    def test_team_name_not_unqiue(self):
        team2 = Team.objects.create(
            name='TSV Ismaning 2',
            beachname='THC Eh Drin! 2',
            tournament=self.tournament,
            trainer=self.user,
        )
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': team2.id}), {
                                  'name': 'TSV Ismaning',
                                  'beachname': 'THC Eh Drin!'
                              })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 400)
        self.assertDictEqual(data, {
            'detail': ['Name already taken'],
            'key': ['name_already_taken']
        })

        self.assertEqual(Team.objects.last().name, team2.name)
        self.assertEqual(Team.objects.last().beachname, team2.beachname)

    def test_team_name_not_unqiue_without_beachname(self):
        team2 = Team.objects.create(
            name='TSV Ismaning 2',
            beachname='THC Eh Drin! 2',
            tournament=self.tournament,
            trainer=self.user,
        )
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': team2.id}), {
                                  'name': 'TSV Ismaning',
                              })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 400)
        self.assertDictEqual(data, {
            'detail': ['Name already taken'],
            'key': ['name_already_taken']
        })

        self.assertEqual(Team.objects.last().name, team2.name)
        self.assertEqual(Team.objects.last().beachname, team2.beachname)

    def test_team_update_after_deadline_staff(self):
        self.tournament.deadline_edit = timezone.now() - timezone.timedelta(days=3)
        self.tournament.save()

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), {
                                  'name': 'TSV Ismaning 2',
                                  'beachname': 'New Name Name',
                              })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['beachname'], 'New Name Name')
        self.assertEqual(Team.objects.first().beachname, 'New Name Name')
        self.assertEqual(data['name'], 'TSV Ismaning 2')
        self.assertEqual(Team.objects.first().name, 'TSV Ismaning 2')

    def test_team_update_after_deadline_trainer(self):
        self.tournament.deadline_edit = timezone.now() - timezone.timedelta(days=3)
        self.tournament.save()
        self.user.is_staff = False
        self.user.save()

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.put(reverse('v1:team-detail',
                                      kwargs={'pk': self.team.id}), {
                                  'name': 'TSV Ismaning 2',
                                  'beachname': 'New Name Name',
                              })
        data = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, 400)
        self.assertDictEqual(data, {
            'detail': 'Team Update not possible after Edit-Deadline',
            'key': 'after_deadline_edit',
        })
        self.assertNotEqual(Team.objects.first().beachname, 'New Name Name')
        self.assertNotEqual(Team.objects.first().name, 'TSV Ismaning 2')

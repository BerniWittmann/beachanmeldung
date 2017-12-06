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
        self.user = MyUser.objects.create(email='test@byom.de',
                                          first_name='Test',
                                          last_name='User',
                                          phone='+49192481024')
        self.user.set_password('test123')
        self.user.is_verified = True
        self.user.is_staff = True
        self.user.save()
        other_user = MyUser.objects.create(email='another_test@byom.de',
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
        other_tournament = Tournament.objects \
            .create(name='Another Test Turnier',
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
        Team.objects.create(
            name='Other Team',
            beachname='Another Name',
            tournament=other_tournament,
            trainer=other_user,
        )

    def test_team_delete(self):
        id = self.team.id
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = client.delete(reverse('v1:team-detail',
                                         kwargs={'pk': self.team.id}))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Team.objects.all().count(), 1)
        self.assertNotEqual(Team.objects.first().id, id)
        self.assertIsNotNone(self.tournament)
        self.assertIsNotNone(self.user)
        self.assertEqual(Tournament.objects.all().count(), 2)
        self.assertEqual(MyUser.objects.all().count(), 2)

    def test_tournament_delete_team(self):
        id = self.team.id
        self.tournament.delete()
        self.assertEqual(Team.objects.all().count(), 1)
        self.assertNotEqual(Team.objects.first().id, id)

    def test_tournament_delete_user(self):
        id = self.team.id
        self.tournament.delete()
        self.assertEqual(Team.objects.all().count(), 1)
        self.assertNotEqual(Team.objects.first().id, id)

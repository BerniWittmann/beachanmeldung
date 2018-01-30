from django.test import Client
from django.test import TestCase
from django.urls import reverse
from django.utils.translation import activate

from api.accounts.models import MyUser
from api.enums import TeamStateTypes
from api.team.models import Team
from api.tournaments.models import Tournament

activate('en-us')


class EmbedTestCase(TestCase):
    tournament = None
    team_1 = None
    team_2 = None

    def setUp(self):
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
                    number_of_places=2
                    )
        user = MyUser.objects.create(email='test@byom.de',
                                     first_name='Test',
                                     last_name='User',
                                     phone='+49192481024')
        user.set_password('test123')
        user.is_verified = True
        user.is_staff = False
        user.save()
        self.team_1 = Team.objects.create(
            name='TSV Ismaning',
            beachname='THC Eh Drin!',
            tournament=self.tournament,
            state=TeamStateTypes.signed_up,
            trainer=user,
        )
        self.team_2 = Team.objects.create(
            name='TSV Oberhausen',
            beachname='Wieso auch immer',
            tournament=self.tournament,
            trainer=user,
            state=TeamStateTypes.signed_up,
        )
        self.team_3 = Team.objects.create(
            name='TSV Warten',
            beachname='Ich bin auf der Warteliste',
            tournament=self.tournament,
            trainer=user,
            state=TeamStateTypes.waiting,
        )
        self.team_4 = Team.objects.create(
            name='TSV Warten',
            beachname='Ich bin auf ebenfalls der Warteliste',
            tournament=self.tournament,
            trainer=user,
            state=TeamStateTypes.needs_approval,
        )

    def test_get_tournament_signup_embed(self):
        client = Client()
        response = client.get(reverse('embed-tournament-signup-list', kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context.get('tournament_name'), self.tournament.__str__())

    def test_get_tournament_signup_embed_404(self):
        client = Client()
        response = client.get(reverse('embed-tournament-signup-list', kwargs={'pk': 9999999}))
        self.assertEqual(response.status_code, 404)

    def test_get_tournament_signup_embed_full_tournament(self):
        client = Client()
        response = client.get(reverse('embed-tournament-signup-list', kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context.get('teams')), 2)
        self.assertInHTML(self.team_1.complete_name(), response.content.decode('utf-8'))
        self.assertInHTML(self.team_2.complete_name(), response.content.decode('utf-8'))

    def test_get_tournament_signup_embed_free_places(self):
        self.team_1.state = TeamStateTypes.waiting
        self.team_1.save()

        client = Client()
        response = client.get(reverse('embed-tournament-signup-list', kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context.get('teams')), 2)
        self.assertInHTML(self.team_1.complete_name(), response.content.decode('utf-8'), count=0)
        self.assertInHTML(self.team_2.complete_name(), response.content.decode('utf-8'))

    def test_get_tournament_signup_embed_empty(self):
        self.team_1.state = TeamStateTypes.waiting
        self.team_1.save()
        self.team_2.state = TeamStateTypes.needs_approval
        self.team_2.save()

        client = Client()
        response = client.get(reverse('embed-tournament-signup-list', kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context.get('teams')), 2)
        self.assertInHTML(self.team_1.complete_name(), response.content.decode('utf-8'), count=0)
        self.assertInHTML(self.team_2.complete_name(), response.content.decode('utf-8'), count=0)

    def test_get_tournament_wait_embed(self):
        client = Client()
        response = client.get(reverse('embed-tournament-wait-list', kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context.get('tournament_name'), self.tournament.__str__())

    def test_get_tournament_wait_embed_404(self):
        client = Client()
        response = client.get(reverse('embed-tournament-wait-list', kwargs={'pk': 9999999}))
        self.assertEqual(response.status_code, 404)

    def test_get_tournament_wait_embed_full_tournament(self):
        client = Client()
        response = client.get(reverse('embed-tournament-wait-list', kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context.get('teams')), 2)
        self.assertInHTML(self.team_3.complete_name(), response.content.decode('utf-8'))
        self.assertInHTML(self.team_4.complete_name(), response.content.decode('utf-8'))

    def test_get_tournament_wait_embed_empty(self):
        self.team_3.state = TeamStateTypes.denied
        self.team_3.save()
        self.team_4.state = TeamStateTypes.signed_up
        self.team_4.save()

        client = Client()
        response = client.get(reverse('embed-tournament-wait-list', kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context.get('teams')), 0)
        self.assertInHTML(self.team_3.complete_name(), response.content.decode('utf-8'), count=0)
        self.assertInHTML(self.team_4.complete_name(), response.content.decode('utf-8'), count=0)

    def test_get_tournament_complete_embed(self):
        client = Client()
        response = client.get(reverse('embed-tournament-complete-list', kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context.get('tournament_name'), self.tournament.__str__())
        self.assertContains(response, '<table', count=2)

    def test_get_tournament_complete_embed_404(self):
        client = Client()
        response = client.get(reverse('embed-tournament-complete-list', kwargs={'pk': 9999999}))
        self.assertEqual(response.status_code, 404)

    def test_get_tournament_complete_embed_full_tournament(self):
        client = Client()
        response = client.get(reverse('embed-tournament-complete-list', kwargs={'pk': self.tournament.id}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context.get('teams')), 2)
        self.assertEqual(len(response.context.get('waitlist_teams')), 2)
        self.assertInHTML(self.team_1.complete_name(), response.content.decode('utf-8'))
        self.assertInHTML(self.team_2.complete_name(), response.content.decode('utf-8'))
        self.assertInHTML(self.team_3.complete_name(), response.content.decode('utf-8'))
        self.assertInHTML(self.team_4.complete_name(), response.content.decode('utf-8'))

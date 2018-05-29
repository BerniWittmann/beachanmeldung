from django.test import TestCase
from django.utils.translation import activate

from api.accounts.models import MyUser
from api.players.models import Player
from api.team.models import Team
from api.tournaments.models import Tournament

activate('en-us')


class Tournaments(TestCase):
    tournament = None
    team = None
    user = None
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

        self.player = Player.objects.create(
            number=1,
            first_name='Test',
            last_name='Player',
            birth_date='1990-01-01',
            team=self.team
        )

    def test_team_complete_name(self):
        self.assertEqual(self.team.complete_name(), 'THC Eh Drin! (TSV Ismaning)')

    def test_team_complete_name_without_beachname(self):
        self.team.beachname = None
        self.team.save()
        self.assertEqual(self.team.complete_name(), 'TSV Ismaning')

    def test_team_has_players(self):
        self.assertTrue(self.team.has_players())

    def test_team_has_no_players(self):
        self.player.delete()
        self.assertFalse(self.team.has_players())

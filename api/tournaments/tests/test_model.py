from django.test import TestCase
from django.utils import timezone
from django.utils.translation import activate

from api.accounts.models import MyUser
from api.enums import TeamStateTypes
from api.team.models import Team
from api.tournaments.models import Tournament

activate('en-us')


class Tournaments(TestCase):
    tournament = None
    user = None

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
                    number_of_places=23
                    )
        self.user = MyUser.objects.create(email='test@byom.de',
                                          first_name='Test',
                                          last_name='User',
                                          phone='+49192481024')
        self.user.set_password('test123')
        self.user.is_verified = True
        self.user.is_staff = True
        self.user.save()

    def test_tournament_is_signup_open(self):
        self.tournament.start_signup = timezone.now() + \
                                    timezone.timedelta(days=-1)
        self.tournament.deadline_signup = timezone.now() + \
            timezone.timedelta(days=1)

        self.assertTrue(self.tournament.signup_open())
        self.assertFalse(self.tournament.is_after_signup())
        self.assertFalse(self.tournament.is_before_signup())

    def test_tournament_is_signup_not_open(self):
        self.tournament.start_signup = timezone.now() + \
                                       timezone.timedelta(days=-2)
        self.tournament.deadline_signup = timezone.now() + \
            timezone.timedelta(days=-1)

        self.assertFalse(self.tournament.signup_open())

        self.tournament.start_signup = timezone.now() + \
            timezone.timedelta(days=2)
        self.tournament.deadline_signup = timezone.now() + \
            timezone.timedelta(days=3)

        self.assertFalse(self.tournament.signup_open())

    def test_tournament_is_before_signup(self):
        self.tournament.start_signup = timezone.now() + \
                                       timezone.timedelta(days=2)
        self.tournament.deadline_signup = timezone.now() + \
            timezone.timedelta(days=3)

        self.assertFalse(self.tournament.signup_open())
        self.assertFalse(self.tournament.is_after_signup())
        self.assertTrue(self.tournament.is_before_signup())

    def test_tournament_is_after_signup(self):
        self.tournament.start_signup = timezone.now() + \
                                       timezone.timedelta(days=-2)
        self.tournament.deadline_signup = timezone.now() + \
            timezone.timedelta(days=-3)

        self.assertFalse(self.tournament.signup_open())
        self.assertTrue(self.tournament.is_after_signup())
        self.assertFalse(self.tournament.is_before_signup())

    def test_tournament_team_count_empty(self):
        self.assertEqual(self.tournament.active_teams().count(), 0)
        self.assertEqual(self.tournament.total_count_teams(), 0)
        self.assertEqual(self.tournament.count_signed_up_teams(), 0)
        self.assertEqual(self.tournament.free_places(), 23)
        self.assertEqual(self.tournament.waitlist_count(), 0)
        self.assertEqual(self.tournament.approval_count(), 0)

    def test_tournament_team_count_approval(self):
        Team.objects.create(
            name='TSV Ismaning',
            beachname='THC Eh Drin!',
            tournament=self.tournament,
            trainer=self.user,
            state=TeamStateTypes.needs_approval
        )
        self.assertEqual(self.tournament.active_teams().count(), 1)
        self.assertEqual(self.tournament.total_count_teams(), 1)
        self.assertEqual(self.tournament.count_signed_up_teams(), 0)
        self.assertEqual(self.tournament.free_places(), 23)
        self.assertEqual(self.tournament.waitlist_count(), 1)
        self.assertEqual(self.tournament.approval_count(), 1)

    def test_tournament_team_count_waitlist(self):
        Team.objects.create(
            name='TSV Ismaning',
            beachname='THC Eh Drin!',
            tournament=self.tournament,
            trainer=self.user,
            state=TeamStateTypes.waiting
        )
        self.assertEqual(self.tournament.active_teams().count(), 1)
        self.assertEqual(self.tournament.total_count_teams(), 1)
        self.assertEqual(self.tournament.count_signed_up_teams(), 0)
        self.assertEqual(self.tournament.free_places(), 23)
        self.assertEqual(self.tournament.waitlist_count(), 1)
        self.assertEqual(self.tournament.approval_count(), 0)

    def test_tournament_team_count_signed_up(self):
        Team.objects.create(
            name='TSV Ismaning',
            beachname='THC Eh Drin!',
            tournament=self.tournament,
            trainer=self.user,
            state=TeamStateTypes.signed_up
        )
        self.assertEqual(self.tournament.active_teams().count(), 1)
        self.assertEqual(self.tournament.total_count_teams(), 1)
        self.assertEqual(self.tournament.count_signed_up_teams(), 1)
        self.assertEqual(self.tournament.free_places(), 22)
        self.assertEqual(self.tournament.waitlist_count(), 0)
        self.assertEqual(self.tournament.approval_count(), 0)

    def test_tournament_team_count_denied(self):
        Team.objects.create(
            name='TSV Ismaning',
            beachname='THC Eh Drin!',
            tournament=self.tournament,
            trainer=self.user,
            state=TeamStateTypes.denied
        )
        self.assertEqual(self.tournament.active_teams().count(), 0)
        self.assertEqual(self.tournament.total_count_teams(), 0)
        self.assertEqual(self.tournament.count_signed_up_teams(), 0)
        self.assertEqual(self.tournament.free_places(), 23)
        self.assertEqual(self.tournament.waitlist_count(), 0)
        self.assertEqual(self.tournament.approval_count(), 0)

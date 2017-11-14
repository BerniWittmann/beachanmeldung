from django.test import TestCase
from django.utils import timezone

from api.tournaments.models import Tournament


class Tournaments(TestCase):
    tournament = None

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

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from djmoney.models.fields import MoneyField

from api.enums import TeamStateTypes, TournamentGenderTypes


class Tournament(models.Model):
    name = models.CharField(max_length=120)
    gender = models.CharField(max_length=10,
                              choices=TournamentGenderTypes.
                              choices)
    start_date = models.DateField()
    end_date = models.DateField()
    start_signup = models.DateTimeField(default=timezone.now)
    deadline_signup = models.DateTimeField()
    deadline_edit = models.DateTimeField()
    advertisement_url = models.URLField(null=True,
                                        blank=True)
    contact_email = models.EmailField(null=True,
                                      blank=True)
    starting_fee = MoneyField(max_digits=10,
                              decimal_places=2,
                              default_currency='EUR')
    number_of_places = models.PositiveIntegerField()

    def active_teams(self):
        return self.teams.exclude(state=TeamStateTypes.denied)

    def total_count_teams(self):
        return self.active_teams().count()

    def count_signed_up_teams(self):
        return self.active_teams().filter(state=TeamStateTypes.signed_up).count()

    def free_places(self):
        return self.number_of_places - self.count_signed_up_teams()

    def waitlist_count(self):
        return self.active_teams().filter(state__in=[TeamStateTypes.needs_approval, TeamStateTypes.waiting]).count()

    def approval_count(self):
        return self.active_teams().filter(state__in=[TeamStateTypes.needs_approval]).count()

    def signup_open(self):
        return self.deadline_signup > timezone.now() >= self.start_signup
    signup_open.admin_order_field = 'deadline_signup'
    signup_open.boolean = True
    signup_open.short_description = _('SignUp Possible')

    def is_before_signup(self):
        return timezone.now() < self.start_signup

    def is_after_signup(self):
        return timezone.now() > self.deadline_signup

    def clean(self):
        if self.start_date and self.end_date and \
                        self.start_date > self.end_date:
            raise ValidationError(
                _('StartDate must be before EndDate')
            )

        if self.start_signup and self.deadline_signup and \
           self.start_signup > self.deadline_signup:
            raise ValidationError(
                _('Deadline of Signup must be after Start of Signup')
            )

    def __str__(self):
        if self.gender == TournamentGenderTypes.mixed:
            return self.name

        return self.name + " - " + self.gender

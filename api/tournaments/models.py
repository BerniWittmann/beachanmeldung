from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from djmoney.models.fields import MoneyField

from api.enums import TeamStateTypes, TournamentGenderTypes


class Tournament(models.Model):
    name = models.CharField(max_length=120,
                            help_text=_("Name of the Tournament"),
                            verbose_name=_("Tournament Name"))
    gender = models.CharField(max_length=10,
                              choices=TournamentGenderTypes.
                              choices,
                              help_text=_("Choose a gender for the tournament (female, male, mixed)"),
                              verbose_name=_("Tournament Gender"))
    start_date = models.DateField(help_text=_("The first day when the tournament takes place"),
                                  verbose_name=_("Start Date of the Tournament"))
    end_date = models.DateField(help_text=_("The last day when the tournament takes place"),
                                verbose_name=_("End Date of the Tournament"))
    start_signup = models.DateTimeField(default=timezone.now,
                                        help_text=_("Date when the Signup period starts"),
                                        verbose_name=_("Start of the Signup Period"))
    deadline_signup = models.DateTimeField(help_text=_("Date when the Signup period ends"),
                                           verbose_name=_("End of the Signup Period"))
    deadline_edit = models.DateTimeField(help_text=_("Date by which the Edit by trainers is not possible anymore"),
                                         verbose_name=_("Deadline for Editing"))
    advertisement_url = models.URLField(null=True,
                                        blank=True,
                                        help_text=_("Url to the Advertisement"),
                                        verbose_name=_("Advertisement Url")
                                        )
    contact_email = models.EmailField(null=True,
                                      blank=True,
                                      help_text=_("Contact Email Address for the tournament"),
                                      verbose_name=_("Contact Email")
                                      )
    starting_fee = MoneyField(max_digits=10,
                              decimal_places=2,
                              default_currency='EUR',
                              help_text=_("Initial required payment"),
                              verbose_name=_("Signup Fee"))
    number_of_places = models.PositiveIntegerField(
        help_text=_("Count of possible teams that can take place in the tournament"),
        verbose_name=_("Numer of Places")
    )

    def active_teams(self):
        return self.teams.exclude(state=TeamStateTypes.denied)

    def total_count_teams(self):
        return self.active_teams().count()

    def count_signed_up_teams(self):
        return self.active_teams().filter(state=TeamStateTypes.signed_up).count()

    def free_places(self):
        return max(self.number_of_places - self.count_signed_up_teams(), 0)

    def waitlist_count(self):
        return self.active_teams().filter(state__in=[TeamStateTypes.needs_approval, TeamStateTypes.waiting]).count()

    def approval_count(self):
        return self.active_teams().filter(state__in=[TeamStateTypes.needs_approval]).count()

    def no_places_left_flag(self):
        return self.free_places() == 0

    def few_places_left_flag(self):
        if self.no_places_left_flag():
            return False
        return self.free_places() / self.number_of_places <= 0.25 or self.free_places() <= 2

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

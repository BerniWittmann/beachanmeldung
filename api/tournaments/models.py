from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from djmoney.models.fields import MoneyField
from django.utils.functional import cached_property

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

    class Meta:
        verbose_name = _('Tournament')
        verbose_name_plural = _('Tournaments')

    @cached_property
    def active_teams(self):
        return self.teams.exclude(state=TeamStateTypes.denied)

    @cached_property
    def total_count_teams(self):
        return self.active_teams.count()

    @cached_property
    def signed_up_teams(self):
        return self.active_teams.filter(state=TeamStateTypes.signed_up)

    @cached_property
    def count_signed_up_teams(self):
        return self.signed_up_teams.count()

    @cached_property
    def free_places(self):
        return max(self.number_of_places - self.count_signed_up_teams, 0)

    @cached_property
    def waitlist_count(self):
        return self.active_teams.filter(state__in=[TeamStateTypes.needs_approval, TeamStateTypes.waiting]).count()

    @cached_property
    def approval_count(self):
        return self.active_teams.filter(state__in=[TeamStateTypes.needs_approval]).count()

    @cached_property
    def no_places_left_flag(self):
        return self.free_places == 0

    @cached_property
    def few_places_left_flag(self):
        if self.no_places_left_flag:
            return False
        return self.free_places / self.number_of_places <= 0.25 or self.free_places <= 2

    @cached_property
    def signup_open(self):
        return self.deadline_signup > timezone.now() >= self.start_signup

    signup_open.admin_order_field = 'deadline_signup'
    signup_open.boolean = True
    signup_open.short_description = _('SignUp Possible')

    @cached_property
    def is_before_signup(self):
        return timezone.now() < self.start_signup

    @cached_property
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

    @cached_property
    def has_additional_documents(self):
        return self.documents.count() > 0

    def __str__(self):
        if self.gender == TournamentGenderTypes.mixed:
            return self.name

        return self.name + " - " + str(TournamentGenderTypes.get_choice(self.gender).label)


class AdditionalDocument(models.Model):
    tournament = models.ForeignKey(Tournament,
                                   on_delete=models.CASCADE,
                                   related_name='documents')
    url = models.URLField(help_text=_("Url to Document"),
                          verbose_name=_("Document Url"))
    name = models.CharField(max_length=120,
                            help_text=_("Name of the Document"),
                            verbose_name=_("Document Name"))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('Additional Document')
        verbose_name_plural = _('Additional Documents')

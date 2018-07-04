from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils.functional import cached_property

from api.enums import TeamStateTypes
from api.tournaments.models import Tournament


class Team(models.Model):
    name = models.CharField(max_length=200, help_text=_("Usually the club name"), verbose_name=_("Name"))
    beachname = models.CharField(max_length=400, null=True, blank=True, help_text=_("creative team name"),
                                 verbose_name=_("beachname"))
    date_signup = models.DateTimeField(default=timezone.now, help_text=_("date of initial signup"),
                                       verbose_name=_("Date Signup"))
    state = models.CharField(max_length=50,
                             choices=TeamStateTypes.
                             choices, default=TeamStateTypes.needs_approval,
                             help_text=_("current state of the team"),
                             verbose_name=_("Team State"))
    paid = models.BooleanField(default=False, help_text=_("has the team already paid?"),
                               verbose_name=_("Paid State"))
    tournament = models.ForeignKey(
        Tournament,
        on_delete=models.CASCADE,
        related_name='teams',
        help_text=_("tournament of the team"), verbose_name=_("Team tournament")
    )
    trainer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='teams',
        help_text=_("User account who is responsible for the team"), verbose_name=_("Trainer")
    )

    class Meta:
        unique_together = ("tournament", "name", "beachname")
        verbose_name = _('Team')
        verbose_name_plural = _('Teams')

    @cached_property
    def is_displayed(self):
        return not self.state == TeamStateTypes.denied

    @cached_property
    def complete_name(self):
        if not self.beachname:
            return self.name

        return self.beachname + ' (' + self.name + ')'

    @cached_property
    def has_players(self):
        return self.players.count() > 0

    def __str__(self):
        return self.complete_name()

    def url(self):
        return '/tournament/{}/team/{}'.format(self.tournament.id, self.id)

    @cached_property
    def banking_reference(self):
        return 'Beachanmeldung {} - {}'.format(self.tournament.__str__(), self.complete_name)

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from api.team.models import Team


class Player(models.Model):
    last_name = models.CharField(max_length=200,
                                 help_text=_("Last Name of the player"),
                                 verbose_name=_("Last Name"))
    first_name = models.CharField(max_length=200,
                                  help_text=_("First Name of the player"),
                                  verbose_name=_("First Name"))
    number = models.PositiveIntegerField(help_text=_("shirt number of the player"),
                                         verbose_name=_("Number"))
    year_of_birth = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(timezone.now().year)],
        help_text=_("Use the following format: YYYY"),
        verbose_name=_("Year of Birth"))
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='players',
        help_text=_("Team associated with the player"),
        verbose_name=_("Team")
    )

    class Meta:
        unique_together = (("team", "last_name", "first_name"), ("team", "number"))
        verbose_name = _('Player')
        verbose_name_plural = _('Players')

    def name(self):
        return self.first_name + ' ' + self.last_name

    def __str__(self):
        return self.name()

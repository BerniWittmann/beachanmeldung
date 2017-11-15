from django.conf import settings
from django.db import models
from django.utils import timezone

from api.enums import TeamStateTypes
from api.tournaments.models import Tournament


class Team(models.Model):
    name = models.CharField(max_length=200)
    beachname = models.CharField(max_length=400, null=True, blank=True)
    date_signup = models.DateTimeField(default=timezone.now)
    state = models.CharField(max_length=50,
                             choices=TeamStateTypes.
                             choices, default=TeamStateTypes.needs_approval)
    paid = models.BooleanField(default=False)
    tournament = models.ForeignKey(
        Tournament,
        on_delete=models.CASCADE,
        related_name='teams'
    )
    trainer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='teams'
    )

    class Meta:
        unique_together = ("tournament", "name", "beachname")

    def is_displayed(self):
        return not self.state == TeamStateTypes.denied

    def complete_name(self):
        if not self.beachname:
            return self.name

        return self.beachname + ' (' + self.name + ')'

    def __str__(self):
        return self.complete_name()

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils import timezone

from api.team.models import Team


class Player(models.Model):
    last_name = models.CharField(max_length=200)
    first_name = models.CharField(max_length=200)
    number = models.PositiveIntegerField()
    year_of_birth = models.PositiveIntegerField(
            validators=[
                MinValueValidator(1900),
                MaxValueValidator(timezone.now().year)],
            help_text="Use the following format: YYYY")
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='players'
    )

    class Meta:
        unique_together = (("team", "last_name", "first_name"), ("team", "number"))

    def name(self):
        return self.first_name + ' ' + self.last_name

    def __str__(self):
        return self.name()

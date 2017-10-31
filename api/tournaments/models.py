from django.core.exceptions import ValidationError
from django.db import models
from djchoices import DjangoChoices, ChoiceItem
from djmoney.models.fields import MoneyField
from django.utils.translation import gettext_lazy as _


class TournamentGenderTypes(DjangoChoices):
    female = ChoiceItem()
    male = ChoiceItem()
    mixed = ChoiceItem()


class Tournament(models.Model):
    name = models.CharField(max_length=120)
    gender = models.CharField(max_length=10,
                              choices=TournamentGenderTypes.
                              choices)
    start_date = models.DateField()
    end_date = models.DateField()
    deadline_signup = models.DateTimeField()
    deadline_edit = models.DateTimeField()
    advertisement_url = models.URLField(null=True,
                                        blank=True)
    contact_email = models.EmailField(null=True,
                                      blank=True)
    starting_fee = MoneyField(max_digits=10,
                              decimal_places=2,
                              default_currency='EUR')

    def clean(self):
        if self.start_date and self.end_date and \
                        self.start_date > self.end_date:
            raise ValidationError(
                _('StartDate must be before EndDate')
            )

    def __str__(self):
        if self.gender == TournamentGenderTypes.mixed:
            return self.name

        return self.name + " - " + self.gender

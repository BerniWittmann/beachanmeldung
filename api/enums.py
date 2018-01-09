from django.utils.translation import gettext_lazy as _
from djchoices import DjangoChoices, ChoiceItem


class TournamentGenderTypes(DjangoChoices):
    female = ChoiceItem('female', _('female'))
    male = ChoiceItem('male', _('male'))
    mixed = ChoiceItem('mixed', _('mixed'))


class TeamStateTypes(DjangoChoices):
    waiting = ChoiceItem('waiting', _('waiting'))
    signed_up = ChoiceItem('signed up', _('signed up'))
    needs_approval = ChoiceItem('needs approval', _('needs approval'))
    denied = ChoiceItem('denied', _('denied'))

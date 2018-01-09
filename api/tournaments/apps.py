from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class TournamentsConfig(AppConfig):
    name = 'api.tournaments'
    verbose_name = _('Tournament Administration')

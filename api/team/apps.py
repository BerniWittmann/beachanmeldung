from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class TeamConfig(AppConfig):
    name = 'api.team'
    verbose_name = _('Team Administration')

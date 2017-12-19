from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import Team


class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'beachname', 'tournament', 'trainer', 'paid', 'state')
    search_fields = ('name', 'beachname', 'tournament', 'trainer')
    list_filter = ('paid', 'state', 'tournament__name')
    fieldsets = (
        (None, {'fields': ('name', 'beachname',)}),
        (_('Date'), {'fields': ('date_signup',)}),
        (_('Status'), {'fields': ('state',
                                  'paid',)}),
        (_('Relations'), {'fields': ('trainer', 'tournament',)})
    )


admin.site.register(Team, TeamAdmin)

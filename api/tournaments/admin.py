from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from .models import Tournament


class TournamentAdmin(admin.ModelAdmin):
    list_display = ('name', 'gender', 'signup_open',
                    'deadline_signup', 'count_signed_up_teams')
    fieldsets = (
        (None, {'fields': ('name', 'gender')}),
        (_('Date'), {'fields': ('start_date', 'end_date')}),
        (_('Deadlines'), {'fields': ('start_signup',
                                     'deadline_signup',
                                     'deadline_edit')}),
        (_('General'), {'fields': ('advertisement_url',
                                   'contact_email',
                                   'starting_fee',
                                   'number_of_places')})
    )


admin.site.register(Tournament, TournamentAdmin)

from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from api.team.models import Team
from .models import Tournament


class TeamsInline(admin.TabularInline):
    model = Team
    extra = 0
    show_change_link = True
    fields = ('name', 'beachname', 'trainer', 'paid', 'state')
    ordering = ('state', 'date_signup')
    classes = ('collapse',)


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
    inlines = [TeamsInline]


admin.site.register(Tournament, TournamentAdmin)

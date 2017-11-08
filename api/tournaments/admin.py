from django.contrib import admin
from .models import Tournament


class TournamentAdmin(admin.ModelAdmin):
    list_display = ('name', 'gender', 'signup_open',
                    'deadline_signup')
    fieldsets = (
        (None, {'fields': ('name', 'gender')}),
        ('Date', {'fields': ('start_date', 'end_date')}),
        ('Deadlines', {'fields': ('start_signup',
                                  'deadline_signup',
                                  'deadline_edit')}),
        ('General', {'fields': ('advertisement_url',
                                'contact_email',
                                'starting_fee',
                                'number_of_places')})
    )


admin.site.register(Tournament, TournamentAdmin)

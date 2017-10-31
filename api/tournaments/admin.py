from django.contrib import admin
from .models import Tournament


class TournamentAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {'fields': ('name', 'gender')}),
        ('Date', {'fields': ('start_date', 'end_date')}),
        ('Deadlines', {'fields': ('deadline_signup',
                                  'deadline_edit')}),
        ('General', {'fields': ('advertisement_url',
                                'contact_email',
                                'starting_fee')})
    )


admin.site.register(Tournament, TournamentAdmin)

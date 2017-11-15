from django.contrib import admin

from .models import Team


class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'beachname',)
    fieldsets = (
        (None, {'fields': ('name', 'beachname',)}),
        ('Date', {'fields': ('date_signup',)}),
        ('Status', {'fields': ('state',
                               'paid',)}),
        ('Relations', {'fields': ('trainer', 'tournament',)})
    )


admin.site.register(Team, TeamAdmin)

from django.contrib import admin

from .models import Player


class PlayerAdmin(admin.ModelAdmin):
    list_display = ('id', 'last_name', 'first_name', 'team_name', 'birth_date', 'number', )
    search_fields = ('last_name', 'first_name',)
    list_filter = ('team__tournament__name', 'team__name', 'team__beachname', )

    def team_name(self, player):
        return player.team.complete_name


admin.site.register(Player, PlayerAdmin)

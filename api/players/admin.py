from django.contrib import admin

from .models import Player


class PlayerAdmin(admin.ModelAdmin):
    list_display = ('number', 'first_name', 'last_name')


admin.site.register(Player, PlayerAdmin)

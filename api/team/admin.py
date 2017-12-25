from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from api.enums import TeamStateTypes
from .models import Team


def mark_paid(modeladmin, request, queryset):
    queryset.update(paid=True)


mark_paid.short_description = _("Mark selected teams as paid")


def mark_unpaid(modeladmin, request, queryset):
    queryset.update(paid=False)


mark_unpaid.short_description = _("Mark selected teams as unpaid")


def mark_state_needs_approval(modeladmin, request, queryset):
    queryset.update(state=TeamStateTypes.needs_approval)


mark_state_needs_approval.short_description = _("Mark selected teams as needs approval")


def mark_state_waiting(modeladmin, request, queryset):
    queryset.update(state=TeamStateTypes.waiting)


mark_state_waiting.short_description = _("Mark selected teams as waiting")


def mark_state_signed_up(modeladmin, request, queryset):
    queryset.update(state=TeamStateTypes.signed_up)


mark_state_signed_up.short_description = _("Mark selected teams as signed up")


def mark_state_denied(modeladmin, request, queryset):
    queryset.update(state=TeamStateTypes.denied)


mark_state_denied.short_description = _("Mark selected teams as denied")


class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'beachname', 'tournament', 'trainer', 'paid', 'state')
    search_fields = ('name', 'beachname', 'tournament__name', 'trainer__email')
    list_filter = ('paid', 'state', 'tournament__name')
    fieldsets = (
        (None, {'fields': ('name', 'beachname',)}),
        (_('Date'), {'fields': ('date_signup',)}),
        (_('Status'), {'fields': ('state',
                                  'paid',)}),
        (_('Relations'), {'fields': ('trainer', 'tournament',)})
    )
    actions = [mark_paid, mark_unpaid, mark_state_denied, mark_state_needs_approval, mark_state_signed_up,
               mark_state_waiting]


admin.site.register(Team, TeamAdmin)

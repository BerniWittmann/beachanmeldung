from django.contrib import admin
from ordered_model.admin import OrderedModelAdmin
from .models import TeamMember


class TeamMemberAdmin(OrderedModelAdmin):
    list_display = ('name', 'role', 'email', 'description',
                    'move_up_down_links', 'image_tag',)


admin.site.register(TeamMember, TeamMemberAdmin)

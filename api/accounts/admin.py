from authemail.admin import (EmailUserAdmin, PasswordResetCodeInline,
                             SignupCodeInline)
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

from api.team.models import Team


class MyPasswordResetCodeInline(PasswordResetCodeInline):
    readonly_fields = ('created_at',)


class MySignupCodeInline(SignupCodeInline):
    readonly_fields = ('ipaddr', 'created_at',)


class TeamsInline(admin.TabularInline):
    model = Team
    extra = 0
    show_change_link = True
    fields = ('name', 'beachname', 'trainer', 'paid', 'state')
    ordering = ('state', 'date_signup')
    classes = ('collapse',)


class MyUserAdmin(EmailUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ('first_name', 'last_name', 'phone')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff',
                                       'is_superuser', 'is_verified', 'receive_notifications',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    readonly_fields = ()

    staff_fieldsets = (
        (None, {'fields': ('email',)}),
        (_('Personal Info'), {'fields': ('first_name', 'last_name', 'phone')}),
        (_('Permissions'), {'fields': ('is_active', 'is_verified', 'is_staff',
                                       'receive_notifications',)}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    staff_readonly_fields = ('last_login', 'date_joined', 'is_staff', 'is_active', 'password')

    inlines = [MyPasswordResetCodeInline, MySignupCodeInline, TeamsInline]

    def change_view(self, request, *args, **kwargs):
        # for non-superuser
        if not request.user.is_superuser:
            try:
                self.fieldsets = self.staff_fieldsets
                self.readonly_fields = self.staff_readonly_fields
                response = super(MyUserAdmin, self).change_view(request, *args, **kwargs)
            finally:
                # Reset fieldsets to its original value
                self.fieldsets = EmailUserAdmin.fieldsets
                self.readonly_fields = EmailUserAdmin.readonly_fields
            return response
        else:
            return super(MyUserAdmin, self).change_view(request, *args, **kwargs)


admin.site.unregister(get_user_model())
admin.site.register(get_user_model(), MyUserAdmin)

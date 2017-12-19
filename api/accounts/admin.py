from authemail.admin import (EmailUserAdmin, PasswordResetCodeInline,
                             SignupCodeInline)
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _


class MyPasswordResetCodeInline(PasswordResetCodeInline):
    readonly_fields = ('created_at',)


class MySignupCodeInline(SignupCodeInline):
    readonly_fields = ('ipaddr', 'created_at',)


class MyUserAdmin(EmailUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff',
                                       'is_superuser', 'is_verified',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
        (_('Custom info'), {'fields': ('phone', 'receive_notifications',)}),
    )
    inlines = [MyPasswordResetCodeInline, MySignupCodeInline]


admin.site.unregister(get_user_model())
admin.site.register(get_user_model(), MyUserAdmin)

from django.contrib import admin
from django.contrib.auth import get_user_model
from authemail.admin import (EmailUserAdmin, PasswordResetCodeInline,
                             SignupCodeInline)


class MyPasswordResetCodeInline(PasswordResetCodeInline):
    readonly_fields = ('created_at',)


class MySignupCodeInline(SignupCodeInline):
    readonly_fields = ('ipaddr', 'created_at',)


class MyUserAdmin(EmailUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff',
                                    'is_superuser', 'is_verified',
                                    'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Custom info', {'fields': ('phone',)}),
    )
    inlines = [MyPasswordResetCodeInline, MySignupCodeInline]


admin.site.unregister(get_user_model())
admin.site.register(get_user_model(), MyUserAdmin)

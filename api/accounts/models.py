from authemail.models import EmailUserManager, EmailAbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.utils.translation import gettext_lazy as _


class MyUser(EmailAbstractUser):
    # Custom fields
    date_of_birth = models.DateField('Date of birth', null=True,
                                     blank=True)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$',
                                 message="Phone number must be entered in the format: "
                                         "'+999999999'. Up to 15 digits allowed.")
    phone = models.CharField(validators=[phone_regex], max_length=17, blank=False,
                             help_text=_("Phone number, preferrably mobile"), verbose_name=_("Phone number"))
    receive_notifications = models.BooleanField(default=False, verbose_name=_("Receive Signup Notifications"),
                                                help_text=_("Receive a Email Notification when a new team is created"))

    # Required
    objects = EmailUserManager()

    def __str__(self):
        return self.first_name + " " + self.last_name + " (" + self.email + ")"

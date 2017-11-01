from django.utils import timezone
from rest_framework import serializers
from .models import Tournament
from django.utils.translation import gettext_lazy as _


class TournamentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'name', 'gender', 'start_date', 'end_date',
                  'deadline_signup', 'deadline_edit', 'advertisement_url',
                  'contact_email', 'starting_fee', 'signup_open', 'start_signup')

    def validate(self, data):
        start_date = data.get('start_date', self.instance.start_date if
                              self.instance else None)
        end_date = data.get('end_date', self.instance.end_date if
                            self.instance else None)

        if start_date > end_date:
            raise serializers.ValidationError(
                _('StartDate must be before EndDate')
            )

        start_signup = data.get('start_signup', self.instance.start_signup if
                                self.instance and self.instance.start_signup is not None else timezone.now())
        deadline_signup = data.get('deadline_signup', self.instance.deadline_signup if
                                   self.instance else None)

        if start_signup > deadline_signup:
            raise serializers.ValidationError(
                _('Deadline of Signup must be after Start of Signup')
            )

        return data

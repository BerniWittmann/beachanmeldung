from rest_framework import serializers
from .models import Tournament
from django.utils.translation import gettext_lazy as _


class TournamentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'name', 'gender', 'start_date', 'end_date',
                  'deadline_signup', 'deadline_edit', 'advertisement_url',
                  'contact_email', 'starting_fee')

    def validate(self, data):
        start_date = data.get('start_date', self.instance.start_date if
                              self.instance else None)
        end_date = data.get('end_date', self.instance.end_date if
                            self.instance else None)

        if start_date > end_date:
            raise serializers.ValidationError(
                _('StartDate must be before EndDate')
            )

        return data

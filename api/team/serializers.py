from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from api.accounts.serializers import UserSerializer
from api.enums import TeamStateTypes
from api.tournaments.models import Tournament
from api.tournaments.serializers import TournamentSerializer
from .models import Team


class TeamSerializer(serializers.Serializer):
    id = serializers.IntegerField(label='ID', read_only=True)
    name = serializers.CharField(max_length=200, required=True)
    beachname = serializers.CharField(allow_blank=True,
                                      allow_null=True,
                                      max_length=400,
                                      required=True)
    date_signup = serializers.DateTimeField(read_only=True)
    state = serializers.ChoiceField(choices=TeamStateTypes.choices,
                                    read_only=True)
    paid = serializers.BooleanField(read_only=True)
    trainer = serializers.SerializerMethodField(required=False)
    tournament = TournamentSerializer(required=False)
    is_displayed = serializers.ReadOnlyField(read_only=True)
    complete_name = serializers.ReadOnlyField(read_only=True)
    tournament_id = serializers.IntegerField(write_only=True)

    def validate(self, data):
        try:
            tournament = Tournament.objects.get(pk=data.get('tournament_id')) \
                if not self.instance else self.instance.tournament
        except ObjectDoesNotExist:
            raise serializers.ValidationError(
                _('Tournament not Found')
            )

        unique_error = serializers.ValidationError(
                _('Name already taken')
            )
        for team in tournament.teams.all().exclude(id=self.context.get('team_id')):
            if data['beachname'] is None:
                if team.name == data['name']:
                    raise unique_error
            else:
                if team.name == data['name'] and team.beachname == data['beachname']:
                    raise unique_error

        return data

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.beachname = validated_data.get('beachname', instance.beachname)
        instance.save()
        return instance

    def create(self, validated_data):
        tournament = Tournament.objects.get(pk=validated_data['tournament_id'])
        trainer = self.context['request'].user

        obj = Team.objects.create(**validated_data, trainer=trainer,
                                  tournament=tournament)
        obj.save()
        return obj

    def get_trainer(self, obj):
        request = self.context['request']
        if request.user and (request.user.is_staff or request.user == obj.trainer):
            return UserSerializer(obj.trainer).data

        return {}

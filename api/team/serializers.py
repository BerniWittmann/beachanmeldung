from collections import OrderedDict

from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.fields import SkipField
from rest_framework.relations import PKOnlyObject

from api.accounts.serializers import UserSerializer
from api.enums import TeamStateTypes
from api.players.models import Player
from api.players.serializers import PlayerSerializer
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
    state = serializers.ChoiceField(choices=TeamStateTypes.choices)
    paid = serializers.BooleanField()
    trainer = serializers.SerializerMethodField(required=False)
    tournament = TournamentSerializer(required=False)
    is_displayed = serializers.ReadOnlyField(read_only=True)
    complete_name = serializers.ReadOnlyField(read_only=True)
    tournament_id = serializers.IntegerField(write_only=True)
    players = PlayerSerializer(many=True, required=False)
    has_players = serializers.BooleanField(read_only=True)

    def validate(self, data):
        try:
            tournament = Tournament.objects.get(pk=data.get('tournament_id')) \
                if not self.instance else self.instance.tournament
        except ObjectDoesNotExist:
            raise serializers.ValidationError(
                _('Tournament not Found')
            )

        unique_error = serializers.ValidationError({
            'detail': _('Name already taken'),
            'key': _('name_already_taken')
        })
        for team in tournament.teams.all().exclude(id=self.context.get('team_id')):
            if data.get('beachname') is None:
                if team.name == data.get('name'):
                    raise unique_error
            else:
                if team.name == data.get('name') and team.beachname == data.get('beachname'):
                    raise unique_error

        number_list = []
        name_list = []
        players = data.get('players', [])
        for player in players:
            number_list.append(player.get('number'))
            name_list.append(player.get('first_name') + '-' + player.get('last_name'))

        if len(list(set(number_list))) != len(number_list):
            raise serializers.ValidationError({
                'detail': _('Duplicate Player Number'),
                'key': _('duplicate_player_number')
            })

        if len(list(set(name_list))) != len(name_list):
            raise serializers.ValidationError({
                'detail': _('Duplicate Player Name'),
                'key': _('duplicate_player_name')
            })
        return data

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.beachname = validated_data.get('beachname', instance.beachname)
        instance.state = validated_data.get('state', instance.state)
        instance.paid = validated_data.get('paid', instance.paid)

        if validated_data.get('players') is not None:
            Player.objects.filter(team=instance).delete()
            players = validated_data.get('players', [])
            if players is not None:
                for player in players:
                    Player.objects.create(team=instance, **player)

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

    def to_representation(self, instance):
        """
        Object instance -> Dict of primitive datatypes.
        """
        ret = OrderedDict()
        fields = self._readable_fields

        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue

            # We skip `to_representation` for `None` values so that fields do
            # not have to explicitly deal with that case.
            #
            # For related fields with `use_pk_only_optimization` we need to
            # resolve the pk value.
            check_for_none = attribute.pk if isinstance(attribute, PKOnlyObject) else attribute
            if check_for_none is None:
                ret[field.field_name] = None
            else:
                request = self.context.get('request')
                if field.field_name == 'players' and not (
                            request.user and (request.user.is_staff or request.user.id == instance.trainer.id)):
                    ret[field.field_name] = []
                else:
                    ret[field.field_name] = field.to_representation(attribute)

        return ret

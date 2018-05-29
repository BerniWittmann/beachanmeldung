from rest_framework import serializers

from api.team.serializers import TeamSerializer
from .models import Player


class PlayerListSerializer(serializers.ModelSerializer):
    team = TeamSerializer(required=False)
    birth_date = serializers.DateField(input_formats=['iso-8601', '%d.%m.%Y'])

    class Meta:
        model = Player
        fields = ('first_name', 'last_name', 'name',
                  'id', 'birth_date', 'number', 'team')
        read_only_fields = ('id',)

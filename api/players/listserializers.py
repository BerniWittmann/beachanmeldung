from rest_framework import serializers

from api.team.serializers import TeamSerializer
from .models import Player


class PlayerListSerializer(serializers.ModelSerializer):
    team = TeamSerializer(required=False)

    class Meta:
        model = Player
        fields = ('first_name', 'last_name', 'name',
                  'id', 'year_of_birth', 'number', 'team')
        read_only_fields = ('id',)

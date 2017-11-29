from rest_framework import serializers

from .models import Player


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ('first_name', 'last_name', 'name',
                  'id', 'year_of_birth', 'number')
        read_only_fields = ('id',)

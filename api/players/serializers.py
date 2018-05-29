from rest_framework import serializers

from .models import Player


class PlayerSerializer(serializers.ModelSerializer):
    birth_date = serializers.DateField(input_formats=['iso-8601', '%d.%m.%Y'])

    class Meta:
        model = Player
        fields = ('first_name', 'last_name', 'name',
                  'id', 'birth_date', 'number')
        read_only_fields = ('id',)

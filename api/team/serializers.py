from rest_framework import serializers


class TeamMemberSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=50)
    role = serializers.CharField(max_length=30)
    description = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    image = serializers.ImageField()
    thumbnail = serializers.ImageField()

import re

from django.contrib.auth import get_user_model
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('email', 'first_name', 'last_name', 'is_staff',
                  'is_verified', 'date_joined', 'phone')
        read_only_fields = ('is_staff', 'is_verified', 'data_joined')

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email',
                                            instance.email)
        instance.first_name = validated_data.get('first_name',
                                                 instance.first_name)
        instance.last_name = validated_data.get('last_name',
                                                instance.last_name)
        instance.phone = validated_data.get('phone', instance.phone)

        instance.save()
        return instance


class CustomSignupSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=128)
    first_name = serializers.CharField(max_length=30, default='',
                                       required=False)
    last_name = serializers.CharField(max_length=30, default='',
                                      required=False)
    phone = serializers.CharField(max_length=17, required=True)

    def validate_phone(self, value):
        phone_pattern = re.compile("^\+?1?\d{9,15}$")
        if not phone_pattern.match(value):
            raise serializers.ValidationError("Phone Number is not valid")
        return value

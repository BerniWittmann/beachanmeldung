# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from api.enums import TeamStateTypes
from .listserializers import PlayerListSerializer
from .models import Player


class PlayerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Player.objects.exclude(team__state=TeamStateTypes.denied)
    permission_classes = (IsAdminUser,)
    serializer_class = PlayerListSerializer
    pagination_class = None

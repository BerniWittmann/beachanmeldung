# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from api.enums import TeamStateTypes
from .listserializers import PlayerListSerializer
from .models import Player


class PlayerViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (IsAdminUser,)
    serializer_class = PlayerListSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Player.objects.all()
        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)

        queryset.exclude(team__state=TeamStateTypes.denied)

        return queryset

from rest_framework import viewsets
from api.permissions import IsAdminOrReadOnly
from .models import Tournament
from .serializers import TournamentSerializer


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all().order_by('start_date')
    permission_classes = (IsAdminOrReadOnly,)
    serializer_class = TournamentSerializer

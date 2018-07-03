from rest_framework import viewsets

from api.permissions import IsAdminOrReadOnly
from .models import Tournament
from .serializers import TournamentSerializer


class TournamentViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdminOrReadOnly,)
    serializer_class = TournamentSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Tournament.objects.all()
        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)

        queryset = queryset.order_by('start_date')
        return queryset

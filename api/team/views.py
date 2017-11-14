from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from rest_framework import viewsets, status
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response

from api.permissions import IsTrainerOrAdminOrReadOnly
from .models import Team
from .serializers import TeamSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().order_by('date_signup')
    permission_classes = (IsTrainerOrAdminOrReadOnly,)
    serializer_class = TeamSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    @detail_route(methods=['put', 'patch'], permission_classes=[IsTrainerOrAdminOrReadOnly])
    def update(self, request, pk=None, **kwargs):
        data = {
            'name': request.data.get('name'),
            'beachname': request.data.get('beachname'),
        }
        try:
            team = Team.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response(_('Team not found'), status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(self.request, team)

        serializer = TeamSerializer(team, data=data, partial=True, context={'request': self.request, 'team_id': pk})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=['post'], permission_classes=[IsTrainerOrAdminOrReadOnly])
    def create(self, request, **kwargs):
        data = {
            'name': request.data.get('name'),
            'beachname': request.data.get('beachname'),
            'tournament_id': request.data.get('tournament'),
        }

        serializer = TeamSerializer(data=data, context={'request': self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import viewsets, status
from rest_framework.decorators import detail_route, list_route
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from api.enums import TeamStateTypes
from api.permissions import IsTrainerOrAdminOrReadOnly
from api.tournaments.models import Tournament
from .models import Team
from .serializers import TeamSerializer


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().exclude(state=TeamStateTypes.denied).order_by('date_signup')
    permission_classes = (IsTrainerOrAdminOrReadOnly,)
    serializer_class = TeamSerializer
    pagination_class = None

    def get_serializer_context(self):
        return {'request': self.request}

    @detail_route(methods=['put', 'patch'], permission_classes=[IsTrainerOrAdminOrReadOnly])
    def update(self, request, pk=None, **kwargs):
        players = None
        if 'players' in request.data:
            players = request.data.get('players', [])
            players = [] if players == '[]' else players

        data = {
            'name': request.data.get('name'),
            'beachname': request.data.get('beachname'),
            'players': players,
        }
        team = get_object_or_404(Team.objects.all(), pk=pk)
        self.check_object_permissions(self.request, team)

        serializer = TeamSerializer(team, data=data, partial=True, context={'request': request, 'team_id': pk})
        if serializer.is_valid():
            tournament = team.tournament
            if timezone.now() > tournament.deadline_edit and not request.user.is_staff:
                return Response({
                    'detail': _('Team Update not possible after Edit-Deadline'),
                    'key': 'after_deadline_edit'
                }, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=['post'], permission_classes=[IsTrainerOrAdminOrReadOnly])
    def create(self, request, **kwargs):
        data = {
            'name': request.data.get('name'),
            'beachname': request.data.get('beachname'),
            'tournament_id': request.data.get('tournament'),
            'paid': False,
            'state': TeamStateTypes.needs_approval
        }

        serializer = TeamSerializer(data=data, context={'request': self.request})
        if serializer.is_valid():
            tournament = Tournament.objects.get(pk=data.get('tournament_id'))
            if timezone.now() < tournament.start_signup:
                return Response({
                    'detail': _('Team Creation not possible before Signup period has started'),
                    'key': 'before_start_signup'
                }, status=status.HTTP_400_BAD_REQUEST)

            if timezone.now() > tournament.deadline_signup:
                return Response({
                    'detail': _('Team Creation not possible after Signup period has ended'),
                    'key': 'after_deadline_signup'
                }, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @detail_route(methods=['post', 'put'], permission_classes=[IsAdminUser])
    def update_state(self, request, pk=None, **kwargs):
        if not request.user:
            return Response({'detail': _('Authentication credentials were not provided.')},
                            status=status.HTTP_401_UNAUTHORIZED)

        if not request.user.is_staff:
            return Response({'detail': _('You do not have permission to perform this action.')},
                            status=status.HTTP_403_FORBIDDEN)

        team = get_object_or_404(Team.objects.all(), pk=pk)
        serializer = TeamSerializer(team, data=request.data, partial=True,
                                    context={'request': self.request, 'team_id': pk})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def set_paid_state(self, request, pk=None, state=False, **kwargs):
        if not request.auth:
            return Response({'detail': _('Authentication credentials were not provided.')},
                            status=status.HTTP_401_UNAUTHORIZED)

        if not request.user.is_staff:
            return Response({'detail': _('You do not have permission to perform this action.')},
                            status=status.HTTP_403_FORBIDDEN)

        team = get_object_or_404(Team.objects.all(), pk=pk)
        serializer = TeamSerializer(team, data={'paid': state}, partial=True,
                                    context={'request': self.request, 'team_id': pk})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @detail_route(methods=['post'], permission_classes=[IsAdminUser])
    def mark_paid(self, request, pk=None, **kwargs):
        return self.set_paid_state(request, pk, True, **kwargs)

    @detail_route(methods=['post'], permission_classes=[IsAdminUser])
    def mark_unpaid(self, request, pk=None, **kwargs):
        return self.set_paid_state(request, pk, False, **kwargs)

    @detail_route(methods=['get'], permission_classes=[IsAuthenticated])
    def get_by_user(self, request, **kwargs):
        if not request.auth:
            return Response({'detail': _('Authentication credentials were not provided.')},
                            status=status.HTTP_401_UNAUTHORIZED)

        teams = Team.objects.all().filter(trainer=request.user)
        return Response(TeamSerializer(teams, many=True, context={'request': request}).data, status=status.HTTP_200_OK)

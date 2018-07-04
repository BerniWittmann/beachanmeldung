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
from .MailSender import TeamMailSender
from .models import Team
from .serializers import TeamSerializer


class TeamViewSet(viewsets.ModelViewSet):
    permission_classes = (IsTrainerOrAdminOrReadOnly,)
    serializer_class = TeamSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Team.objects.all()
        # Set up eager loading to avoid N+1 selects
        queryset = self.get_serializer_class().setup_eager_loading(queryset)

        queryset.exclude(state=TeamStateTypes.denied).order_by('date_signup')

        return queryset

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

            team = get_object_or_404(Team.objects.all(), pk=serializer.data.get('id'))
            mail_sender = TeamMailSender(team=team, request=self.request)
            mail_sender.send_signup_preliminary_confirmation()
            mail_sender.send_needs_approval_notification()

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

            state = serializer.data.get('state')
            mail_sender = TeamMailSender(team=team, request=request)
            if state == TeamStateTypes.signed_up:
                mail_sender.send_signup_confirmation()
            elif state == TeamStateTypes.needs_approval:
                mail_sender.send_needs_approval_notification()
            elif state == TeamStateTypes.denied:
                mail_sender.send_signoff_confirmation()
            elif state == TeamStateTypes.waiting:
                mail_sender.send_waitlist_confirmation()

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
            if state is True:
                TeamMailSender(team=team, request=request).send_payment_confirmation()

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

        queryset = Team.objects.all()
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        teams = queryset.filter(trainer=request.user)
        return Response(TeamSerializer(teams, many=True, context={'request': request}).data, status=status.HTTP_200_OK)

    def send_reminder(self, request, type, **kwargs):
        if not request.auth:
            return Response({'detail': _('Authentication credentials were not provided.')},
                            status=status.HTTP_401_UNAUTHORIZED)

        if not request.user.is_staff:
            return Response({'detail': _('You do not have permission to perform this action.')},
                            status=status.HTTP_403_FORBIDDEN)

        if not request.data or request.data.get('teams') is None \
                or request.data.get('teams') == [] or len(request.data.get('teams')) == 0:
            return Response({'detail': _('You did not provide Team IDs.')},
                            status=status.HTTP_400_BAD_REQUEST)

        request_data_dict = dict(request.data)
        team_ids = request_data_dict.get('teams')
        response = {}
        successful_teams_count = 0
        for team_id in team_ids:
            try:
                team = Team.objects.get(pk=team_id)
            except Team.DoesNotExist:
                team = None

            if not team:
                response[team_id] = [_('Team not found')]
                continue

            if type == 'payment' and team.paid:
                response[team_id] = [_('Team has already paid')]
                continue

            if type == 'player_list' and team.has_players:
                response[team_id] = [_('Team has already Players')]
                continue

            if not team.state == TeamStateTypes.signed_up:
                response[team_id] = [_('Team not signed up')]
                continue

            successful_teams_count += 1
            mail_sender = TeamMailSender(team=team, request=request)
            if type == 'payment':
                mail_sender.send_payment_reminder()
            elif type == 'player_list':
                mail_sender.send_player_list_reminder()
            elif type == 'email':
                mail_sender.send_email_reminder(request_data_dict)

        if successful_teams_count == 0:
            return Response(response,
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(response, status=status.HTTP_200_OK)

    @list_route(methods=['post'], permission_classes=[IsAdminUser])
    def send_payment_reminder(self, request, **kwargs):
        return self.send_reminder(request, 'payment', **kwargs)

    @list_route(methods=['post'], permission_classes=[IsAdminUser])
    def send_player_list_reminder(self, request, **kwargs):
        return self.send_reminder(request, 'player_list', **kwargs)

    @list_route(methods=['post'], permission_classes=[IsAdminUser])
    def send_email_reminder(self, request, **kwargs):
        return self.send_reminder(request, 'email', **kwargs)

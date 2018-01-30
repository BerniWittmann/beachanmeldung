# Create your views here.

from django.shortcuts import render, get_object_or_404
from django.views.decorators.clickjacking import xframe_options_exempt

from api.enums import TeamStateTypes
from api.tournaments.models import Tournament


@xframe_options_exempt
def tournament_signup_list(request, pk):
    tournament = get_object_or_404(Tournament.objects.all(), pk=pk)
    teams = list(tournament.teams.filter(state=TeamStateTypes.signed_up))
    while len(teams) < tournament.number_of_places:
        teams.append({})

    context = {'tournament_name': tournament.__str__(), 'teams': teams}
    return render(request, 'embed/signup_list.html', context)


@xframe_options_exempt
def tournament_wait_list(request, pk):
    tournament = get_object_or_404(Tournament.objects.all(), pk=pk)
    teams = list(tournament.teams.filter(state__in=[TeamStateTypes.needs_approval, TeamStateTypes.waiting]))

    context = {'tournament_name': tournament.__str__(), 'teams': teams}
    return render(request, 'embed/wait_list.html', context)


@xframe_options_exempt
def tournament_complete_list(request, pk):
    tournament = get_object_or_404(Tournament.objects.all(), pk=pk)
    teams = list(tournament.teams.filter(state=TeamStateTypes.signed_up))
    while len(teams) < tournament.number_of_places:
        teams.append({})
    waitlist_teams = list(tournament.teams.filter(state__in=[TeamStateTypes.needs_approval, TeamStateTypes.waiting]))

    context = {'tournament_name': tournament.__str__(), 'teams': teams, 'waitlist_teams': waitlist_teams}
    return render(request, 'embed/tournament_list.html', context)

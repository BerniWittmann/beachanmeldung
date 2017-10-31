from django.conf.urls import url

from .views import TournamentViewSet

tournament_list = TournamentViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
tournament_detail = TournamentViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    url(r'^$', tournament_list, name='tournament-list'),
    url(r'^(?P<pk>[0-9]+)/$', tournament_detail, name='tournament-detail'),
]

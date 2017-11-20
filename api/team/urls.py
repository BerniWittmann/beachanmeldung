from django.conf.urls import url

from .views import TeamViewSet

team_list = TeamViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
team_detail = TeamViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

team_update_state = TeamViewSet.as_view({
    'put': 'update_state',
    'post': 'update_state'
})

urlpatterns = [
    url(r'^$', team_list, name='team-list'),
    url(r'^(?P<pk>[0-9]+)/update_state/$', team_update_state, name='team-update-state'),
    url(r'^(?P<pk>[0-9]+)/$', team_detail, name='team-detail'),
]

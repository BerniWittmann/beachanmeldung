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

urlpatterns = [
    url(r'^$', team_list, name='team-list'),
    url(r'^(?P<pk>[0-9]+)/$', team_detail, name='team-detail'),
]

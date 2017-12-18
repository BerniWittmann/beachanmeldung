from django.conf.urls import url

from .views import PlayerViewSet

player_list = PlayerViewSet.as_view({
    'get': 'list',
})
player_detail = PlayerViewSet.as_view({
    'get': 'retrieve',
})

urlpatterns = [
    url(r'^$', player_list, name='player-list'),
    url(r'^(?P<pk>[0-9]+)/$', player_detail, name='player-detail'),
]

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

team_mark_paid = TeamViewSet.as_view({
    'post': 'mark_paid'
})

team_mark_unpaid = TeamViewSet.as_view({
    'post': 'mark_unpaid'
})

team_get_by_user = TeamViewSet.as_view({
    'get': 'get_by_user'
})

team_send_payment_reminder = TeamViewSet.as_view({
    'post': 'send_payment_reminder'
})

team_send_player_list_reminder = TeamViewSet.as_view({
    'post': 'send_player_list_reminder'
})

team_send_email_reminder = TeamViewSet.as_view({
    'post': 'send_email_reminder'
})

urlpatterns = [
    url(r'^$', team_list, name='team-list'),
    url(r'^mine/$', team_get_by_user, name='team-get-by-user'),
    url(r'^send_payment_reminder/', team_send_payment_reminder, name='team-send-payment-reminder'),
    url(r'^send_player_list_reminder/', team_send_player_list_reminder, name='team-send-player-list-reminder'),
    url(r'^send_email_reminder/', team_send_email_reminder, name='team-send-email-reminder'),
    url(r'^(?P<pk>[0-9]+)/update_state/$', team_update_state, name='team-update-state'),
    url(r'^(?P<pk>[0-9]+)/mark_paid/$', team_mark_paid, name='team-mark-paid'),
    url(r'^(?P<pk>[0-9]+)/mark_unpaid/$', team_mark_unpaid, name='team-mark-unpaid'),
    url(r'^(?P<pk>[0-9]+)/$', team_detail, name='team-detail'),
]

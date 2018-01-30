from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^tournament_signup_list/(?P<pk>[0-9]+)/$', views.tournament_signup_list, name='embed-tournament-signup-list'),
    url(r'^tournament_wait_list/(?P<pk>[0-9]+)/$', views.tournament_wait_list, name='embed-tournament-wait-list'),
    url(r'^tournament_complete_list/(?P<pk>[0-9]+)/$', views.tournament_complete_list,
        name='embed-tournament-complete-list'),
]

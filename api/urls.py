from django.conf.urls import url, include

from .views import NotFoundView

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^account/', include('api.accounts.urls')),
    url(r'^tournaments/', include('api.tournaments.urls')),
    url(r'^teams/', include('api.team.urls')),
    url(r'^players/', include('api.players.urls')),
    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
    url('^', NotFoundView.raise_404)
]

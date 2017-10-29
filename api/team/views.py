from rest_framework import viewsets
from .models import TeamMember
from .serializers import TeamMemberSerializer


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer

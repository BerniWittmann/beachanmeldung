from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


class NotFoundView:
    @api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])
    def raise_404(self):
        return Response({'details': _('Route Not Found')}, status=status.HTTP_404_NOT_FOUND)

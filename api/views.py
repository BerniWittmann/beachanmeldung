from constance import config
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])
def raise_404(request):
    return Response({'details': _('Route Not Found')},
                    status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_config(request):
    return Response({
        'year': config.YEAR,
        'welcome_text': config.WELCOME_TEXT,
        'terms_of_participation': config.TERMS_OF_PARTICIPATION,
    }, status=status.HTTP_200_OK)

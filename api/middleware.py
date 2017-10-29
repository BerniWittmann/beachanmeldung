from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model
from django.utils.timezone import now


class DisableCsrfCheck(MiddlewareMixin):
    def process_request(self, req):
        attr = '_dont_enforce_csrf_checks'
        if not getattr(req, attr, False):
            setattr(req, attr, True)


class SetLastLoginMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if request.user:
            # Update last login time after request finished processing.
            get_user_model().objects.filter(pk=request.user.pk)\
                .update(last_login=now())
        return response

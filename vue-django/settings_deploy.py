import os

from decouple import config

from .settings import INSTALLED_APPS, ALLOWED_HOSTS, BASE_DIR, DEBUG, TESTING

INSTALLED_APPS.append('webpack_loader',)
INSTALLED_APPS.append('web.apps.WebConfig',)

if not DEBUG and not TESTING:
    INSTALLED_APPS.append('raven.contrib.django.raven_compat', 'ddtrace.contrib.django',)
    RAVEN_CONFIG = {
        'dsn': config('SENTRY_DSN', default=None),
    }
    DATADOG_TRACE = {
        'DEFAULT_SERVICE': 'beachanmeldung',
        'TAGS': {'env': 'production'},
    }

ALLOWED_HOSTS.append('*',)

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': '/static/',
        'STATS_FILE': os.path.join(BASE_DIR,
                                   'web',
                                   'vueapp',
                                   'webpack-stats.json')
    }
}

INTERNAL_IPS = (
    '0.0.0.0',
    '127.0.0.1',
)

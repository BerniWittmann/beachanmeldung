import os

from .settings import INSTALLED_APPS, ALLOWED_HOSTS, BASE_DIR

INSTALLED_APPS.append('webpack_loader',)
INSTALLED_APPS.append('web.apps.WebConfig',)

ALLOWED_HOSTS.append('*',)

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': '/',
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

STATIC_URL = '/static/'

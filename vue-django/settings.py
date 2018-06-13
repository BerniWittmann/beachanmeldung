"""
Django settings for vue-django project.

Generated by 'django-admin startproject' using Django 1.11.3.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import datetime
import os
import sys

import dj_database_url
from decouple import config
from django.utils.translation import gettext_lazy as _
from corsheaders.defaults import default_headers

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

TESTING = 'test' in sys.argv

ADMINS = [('Berni Wittmann', 'b.wittmann@mail.de')]

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
    'admin_interface',
    'flat_responsive',
    'colorfield',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'debug_toolbar',
    'stdimage',
    'rest_framework',
    'rest_framework.authtoken',
    'djmoney',
    'api.apps.ApiConfig',
    'authemail',
    'api.accounts.apps.AccountsConfig',
    'api.tournaments.apps.TournamentsConfig',
    'api.team.apps.TeamConfig',
    'api.players.apps.PlayersConfig',
    'embed.apps.EmbedConfig',
    'constance',
    'constance.backends.database',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'api.middleware.SetLastLoginMiddleware',
]

if DEBUG:
    MIDDLEWARE.append('api.middleware.DisableCsrfCheck')

ROOT_URLCONF = 'vue-django.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'vue-django.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config('DATABASE_NAME', default=None),
        'USER': config('DATABASE_USER', default=None),
        'PASSWORD': config('DATABASE_PASSWORD', default=None),
        'HOST': config('DATABASE_HOST', default=None),
        'PORT': config('DATABASE_PORT', default=None),
        'CONN_MAX_AGE': 60 * 10,
    }
}

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

CONSTANCE_BACKEND = 'constance.backends.database.DatabaseBackend'

CONSTANCE_CONFIG = {
    'YEAR': (2017, _('Year'), int),
    'WELCOME_TEXT': ('', _('Welcome Text'), str),
    'TERMS_OF_PARTICIPATION': ('', _('Terms of participation'), str),
}

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation'
                '.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation'
                '.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation'
                '.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation'
                '.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'PAGE_SIZE': 10,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.NamespaceVersioning'
}

# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = config('LANGUAGE_CODE')

TIME_ZONE = config('TIME_ZONE')

USE_I18N = True

USE_L10N = True

USE_TZ = True

LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)

CORS_ORIGIN_ALLOW_ALL = False

CORS_ORIGIN_WHITELIST = (
    'localhost:8080',
    'localhost:8000',
    'beach.handballismaning.de',
    'spielplanismaning.herokuapp.com'
    'handballismaning.de',
    'beachanmeldung.handballismaning.de',
    'beachanmeldung.herokuapp.com'
)

CORS_ALLOW_HEADERS = default_headers + (
    'authentication',
)

AUTH_USER_MODEL = 'accounts.MyUser'

AUTH_EMAIL_VERIFICATION = True

JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=7),
}

if not DEBUG and not TESTING:
    CACHES = {
        'default': {
            # Use pylibmc
            'BACKEND': 'django.core.cache.backends.memcached.PyLibMCCache',

            # TIMEOUT is not the connection timeout! It's the default expiration
            # timeout that should be applied to keys! Setting it to `None`
            # disables expiration.
            'TIMEOUT': None,

            'LOCATION': config('MEMCACHIER_SERVERS', None),

            'OPTIONS': {
                # Use binary memcache protocol (needed for authentication)
                'binary': True,
                'username': config('MEMCACHIER_USERNAME', None),
                'password': config('MEMCACHIER_PASSWORD', None),
                'behaviors': {
                    # Enable faster IO
                    'no_block': True,
                    'tcp_nodelay': True,

                    # Keep connection alive
                    'tcp_keepalive': True,

                    # Timeout settings
                    'connect_timeout': 2000,  # ms
                    'send_timeout': 750 * 1000,  # us
                    'receive_timeout': 750 * 1000,  # us
                    '_poll_timeout': 2000,  # ms

                    # Better failover
                    'ketama': True,
                    'remove_failed': 1,
                    'retry_timeout': 2,
                    'dead_timeout': 30,
                }
            }
        }
    }
    INSTALLED_APPS.append('cachalot')

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'web', 'vueapp', 'dist')
]

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')

APPEND_SLASH = True
DEFAULT_EMAIL_FROM = config('DEFAULT_EMAIL_FROM')
DEFAULT_EMAIL_BCC = ''

SEND_EMAIL_ASYNC = config('SEND_EMAIL_ASYNC', default=True, cast=bool)

EMAIL_HOST = config('EMAIL_HOST', default=None)
EMAIL_PORT = config('EMAIL_PORT', default=None)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default=None)
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default=None)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=False)
SERVER_EMAIL = config('SERVER_EMAIL')
EMAIL_BACKEND = "sendgrid_backend.SendgridBackend"
SENDGRID_API_KEY = config('EMAIL_HOST_PASSWORD', default=None)
SENDGRID_SANDBOX_MODE_IN_DEBUG = config('SENDGRID_SANDBOX_MODE_IN_DEBUG', default=True, cast=bool)

try:
    from .settings_deploy import *  # noqa: F403,F401
except ImportError:
    pass

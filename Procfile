release: sh ./release-tasks.sh
web: DATADOG_TRACE_AGENT_PORT=8125 ddtrace-run gunicorn vue-django.wsgi --log-file -
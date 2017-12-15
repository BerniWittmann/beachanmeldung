#!/usr/bin/env bash
echo "Starting Release Tasks"
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py compilemessages
echo "Completed Release Tasks"
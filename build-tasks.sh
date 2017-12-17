#!/usr/bin/env bash
echo "Starting Build Tasks"
python manage.py migrate
echo "Completed Build Tasks"
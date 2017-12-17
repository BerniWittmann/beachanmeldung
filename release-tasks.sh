#!/usr/bin/env bash
echo "Starting Release Tasks"
python manage.py migrate
echo "Completed Release Tasks"
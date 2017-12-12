#!/usr/bin/env bash
echo "Starting Release Tasks"
cd web/vueapp
npm run build

cd ../..
python manage.py collectstatic
python manage.py migrate
python manage.py compilemessages
echo "Completed Release Tasks"
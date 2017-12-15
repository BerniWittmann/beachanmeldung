#!/usr/bin/env bash
echo "Starting Release Tasks"
cd web/vueapp
npm install
npm run build
cd ../..

python manage.py collectstatic --noinput
python manage.py migrate
apt-get update
apt-get install gettext -y
python manage.py compilemessages
echo "Completed Release Tasks"
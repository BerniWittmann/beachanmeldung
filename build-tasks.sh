#!/usr/bin/env bash
echo "Starting Build Tasks"
cd web/vueapp
npm install
npm run build
cd ../..

python manage.py collectstatic --noinput
python manage.py compilemessages
echo "Completed Build Tasks"
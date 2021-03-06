#!/usr/bin/env bash
echo "Starting Build Tasks"

source /app/venv/bin/activate

echo "Bundling Assets"
npm run build

echo "Collect Statics"
python manage.py collectstatic --noinput

echo "Compile Translations"
python manage.py compilemessages

echo "Completed Build Tasks"
web: gunicorn treasurehunt.wsgi
release: python manage.py migrate && python manage.py populate_data && sh build_frontend.sh

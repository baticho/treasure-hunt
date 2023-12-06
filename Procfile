web: gunicorn treasurehunt.wsgi
release: python manage.py migrate && python manage.py populate_data
frontend: cd frontend && npm install && npm run build
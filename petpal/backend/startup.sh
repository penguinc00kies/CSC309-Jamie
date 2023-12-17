#!/bin/bash
cd petpal
chmod u+x manage.py
virtualenv venv
source venv/bin/activate
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install Pillow  
pip install django-filter 
pip install -U drf-yasg 
pip install django-cors-headers
make reset
cd ..
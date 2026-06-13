import os
import sys

# Point to your Django project's root directory if needed, 
# but usually Passenger sets the current working directory properly.
sys.path.insert(0, os.path.dirname(__file__))

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# Expose the WSGI application to Passenger
from config.wsgi import application

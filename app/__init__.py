from flask import Flask
from werkzeug.utils import quote

app = Flask(__name__)

from app import views

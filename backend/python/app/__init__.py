import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from .config import app_config


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(app_config[config_name])
    app.config[
        "SQLALCHEMY_DATABASE_URI"
    ] = "postgres://{username}:{password}@{host}:5432/{db}".format(
        username=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("DB_HOST"),
        db=os.getenv("POSTGRES_DB"),
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    from . import models, routes

    models.init_app(app)
    routes.init_app(app)

    return app

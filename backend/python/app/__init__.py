import os
import firebase_admin

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from logging.config import dictConfig

from .config import app_config


def create_app(config_name):
    # configure Flask logger
    dictConfig(
        {
            "version": 1,
            "handlers": {
                "wsgi": {
                    "class": "logging.FileHandler",
                    "level": "ERROR",
                    "filename": "error.log",
                    "formatter": "default",
                }
            },
            "formatters": {
                "default": {
                    "format": "%(asctime)s-%(levelname)s-%(name)s::%(module)s,%(lineno)s: %(message)s"
                },
            },
            "root": {"level": "ERROR", "handlers": ["wsgi"]},
        }
    )

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
    app.config["MONGODB_URL"] = os.getenv("MG_DATABASE_URL")

    # required for auth
    firebase_admin.initialize_app()

    from . import models

    models.init_app(app)

    return app

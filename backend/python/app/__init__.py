import os
# auth {
import firebase_admin
# } auth

from flask import Flask
from flask.cli import ScriptInfo
from flask_cors import CORS
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

    app = Flask(__name__, template_folder="templates", static_folder="static")
    # do not read config object if creating app from Flask CLI (e.g. flask db migrate)
    if type(config_name) is not ScriptInfo:
        app.config.from_object(app_config[config_name])

    app.config["CORS_ORIGINS"] = ["http://localhost:3000"]
    app.config["CORS_SUPPORTS_CREDENTIALS"] = True
    CORS(app)

    # postgresql {
    app.config[
        "SQLALCHEMY_DATABASE_URI"
    ] = "postgres://{username}:{password}@{host}:5432/{db}".format(
        username=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("DB_TEST_HOST") if app.config["TESTING"] else os.getenv("DB_HOST"),
        db=os.getenv("POSTGRES_DB"),
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    # } postgresql

    # auth {
    # file-storage {
    firebase_admin.initialize_app(None, {"storageBucket": os.getenv("DEFAULT_BUCKET")})
    # } file-storage
    # no-file-storage {
    firebase_admin.initialize_app()
    # } no-file-storage

    # } auth
    from . import models, rest

    models.init_app(app)
    rest.init_app(app)

    return app

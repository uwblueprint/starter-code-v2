from flask_sqlalchemy import SQLAlchemy
from mongoengine import connect

db = SQLAlchemy()
erase_db_and_sync = True


def init_app(app):
    from .entity import Entity
    from .user_pg import User

    app.app_context().push()
    db.init_app(app)

    if erase_db_and_sync:
        # drop tables
        db.reflect()
        db.drop_all()

        # recreate tables
        db.create_all()

    # connect to MongoDB
    connect(host=app.config["MONGODB_URL"])

# postgresql {
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
# } postgresql
# mongodb {
from mongoengine import connect

# } mongodb

# postgresql {
db = SQLAlchemy()
migrate = Migrate()


# } postgresql
def init_app(app):
    from .entity import Entity
    from .simple_entity import SimpleEntity
    # auth {
    from .user import User
    # } auth

    app.app_context().push()
    # postgresql {
    db.init_app(app)
    migrate.init_app(app, db)

    erase_db_and_sync = app.config["TESTING"]

    if erase_db_and_sync:
        # drop tables
        db.reflect()
        db.drop_all()

        # recreate tables
        db.create_all()
    # } postgresql
    # mongodb {
    # connect to MongoDB
    if "MONGODB_URL" in app.config:
        connect(host=app.config["MONGODB_URL"])
    # } mongodb

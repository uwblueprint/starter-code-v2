# postgresql {
from flask_sqlalchemy import SQLAlchemy
# } postgresql
# mongodb {
from mongoengine import connect

# } mongodb

# postgresql {
db = SQLAlchemy()
erase_db_and_sync = True


# } postgresql
def init_app(app):
    from .entity import Entity
    # auth {
    from .user import User
    # } auth

    app.app_context().push()
    # postgresql {
    db.init_app(app)

    if erase_db_and_sync:
        # drop tables
        db.reflect()
        db.drop_all()

        # recreate tables
        db.create_all()
    # } postgresql
    # mongodb {
    # connect to MongoDB
    connect(host=app.config["MONGODB_URL"])
    # } mongodb

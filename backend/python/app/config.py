import os


class Config(object):
    """
    Common configurations
    """

    # put any configurations here that are common across all environments
    # list of available configs: https://flask.palletsprojects.com/en/1.1.x/config/
    MONGODB_URL = os.getenv("MG_DATABASE_URL")


class DevelopmentConfig(Config):
    """
    Development configurations
    """

    DEBUG = True
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    """
    Production configurations
    """

    DEBUG = False


class TestingConfig(Config):
    """
    Testing configurations
    """

    DEBUG = False
    TESTING = True
    MONGODB_URL = "mongomock://localhost"


app_config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}

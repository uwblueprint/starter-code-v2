def init_app(app):
    from . import entity_routes

    # see entity_routes.py for route definitions
    app.register_blueprint(entity_routes.blueprint)
    
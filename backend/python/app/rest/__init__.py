def init_app(app):
    from . import user_routes, auth_routes, entity_routes, documentation_routes

    app.register_blueprint(user_routes.blueprint)
    app.register_blueprint(auth_routes.blueprint)
    app.register_blueprint(entity_routes.blueprint)
    app.register_blueprint(documentation_routes.blueprint)

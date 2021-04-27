def init_app(app):
    from . import user_routes, auth_routes

    app.register_blueprint(user_routes.blueprint)
    app.register_blueprint(auth_routes.blueprint)

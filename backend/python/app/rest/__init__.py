def init_app(app):
    # auth {
    from . import user_routes, auth_routes, entity_routes
    # } auth
    # no-auth {
    from . import entity_routes
    # } no-auth

    # auth {
    app.register_blueprint(user_routes.blueprint)
    app.register_blueprint(auth_routes.blueprint)
    # } auth
    app.register_blueprint(entity_routes.blueprint)

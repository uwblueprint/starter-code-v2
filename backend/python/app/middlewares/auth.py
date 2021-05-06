from flask import current_app, jsonify, request
from functools import wraps

from ..services.implementations.auth_service import AuthService
from ..services.implementations.user_service import UserService

user_service = UserService(current_app.logger)
auth_service = AuthService(current_app.logger, user_service)


def get_access_token(request):
    auth_header = request.headers.get("Authorization")
    if auth_header:
        auth_header_parts = auth_header.split(" ")
        if len(auth_header_parts) >= 2 and auth_header_parts[0].lower() == "bearer":
            return auth_header_parts[1]
    return None


"""
References for creating middleware using Python decorators:
* https://stackoverflow.com/questions/14367991/flask-before-request-add-exception-for-specific-route
* https://stackoverflow.com/questions/5929107/decorators-with-parameters

* Outermost function (i.e. require_authorization_by_role below) is the name of the decorator,
  it can be used to supply arguments to the middleware function (e.g. the roles to check for)
  Note: this layer is NOT needed if the middleware does not require parameters.
* Middle function (i.e. require_authorization below) wraps around the decorated function 
  (an API endpoint) using the functools wraps decorator.
* Innermost function (i.e. wrapper below) defines the actual middleware logic, like checking authorization.
"""


def require_authorization_by_role(roles):
    """
    Determine if request is authorized based on access_token validity and role of client

    :param roles: the set of authorized roles to check for
    :type roles: {str}
    """

    def require_authorization(api_func):
        @wraps(api_func)
        def wrapper(*args, **kwargs):
            access_token = get_access_token(request)
            authorized = auth_service.is_authorized_by_role(access_token, roles)
            if not authorized:
                return (
                    jsonify({"error": "You are not authorized to make this request."}),
                    401,
                )
            return api_func(*args, **kwargs)

        return wrapper

    return require_authorization


def require_authorization_by_user_id(user_id_field):
    """
    Determine if request for a user-specific resource is authorized based on
    access_token validity and if the user_id that the token was issued to matches
    the requested user_id

    :param user_id_field: name of the request parameter containing the requested user_id
    :type user_id_field: str
    """

    def require_authorization(api_func):
        @wraps(api_func)
        def wrapper(*args, **kwargs):
            access_token = get_access_token(request)
            authorized = auth_service.is_authorized_by_user_id(
                access_token, request.view_args.get(user_id_field)
            )
            if not authorized:
                return (
                    jsonify({"error": "You are not authorized to make this request."}),
                    401,
                )
            return api_func(*args, **kwargs)

        return wrapper

    return require_authorization


def require_authorization_by_email(email_field):
    """
    Determine if request for a user-specific resource is authorized based on
    access_token validity and if the email that the token was issued to matches
    the requested email

    :param email_field: name of the request parameter containing the requested email
    :type email_field: str
    """

    def require_authorization(api_func):
        @wraps(api_func)
        def wrapper(*args, **kwargs):
            access_token = get_access_token(request)
            authorized = auth_service.is_authorized_by_email(
                access_token, request.view_args.get(email_field)
            )
            if not authorized:
                return (
                    jsonify({"error": "You are not authorized to make this request."}),
                    401,
                )
            return api_func(*args, **kwargs)

        return wrapper

    return require_authorization

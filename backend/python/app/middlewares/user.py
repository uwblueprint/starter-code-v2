from flask import current_app, jsonify, request
from functools import wraps

from ..resources.create_user_dto import CreateUserDTO
from ..resources.update_user_dto import UpdateUserDTO

def validate_create_user(clazz):
    """
    Determine if request is authorized based on access_token validity and role of client

    :param roles: the set of authorized roles to check for
    :type roles: {str}
    """

    def validate_dto(api_func):
        @wraps(api_func)
        def wrapper(*args, **kwargs):
            user = eval(clazz)(**request.json)
            isValid = user.validate()
            if not isValid:
                return (
                    jsonify({"error": "There is a type error in this request."}),
                    400,
                )
            return api_func(*args, **kwargs)

        return wrapper

    return validate_dto
from flask import current_app, jsonify, request
from functools import wraps

from ..resources.create_user_dto import CreateUserDTO
from ..resources.update_user_dto import UpdateUserDTO


def validate_request_user(dto_class_name):
    """
    Determine if request is valid based on the types of the arguments passed in to create or update a user

    :param dto_class_name: the class name to create or update user dto
    :type dto_class_name: str
    """

    def validate_dto(api_func):
        @wraps(api_func)
        def wrapper(*args, **kwargs):
            dto = eval(dto_class_name)(**request.json)
            error_message = dto.validate()
            if error_message:
                return (
                    jsonify({"error": error_message}),
                    400,
                )
            return api_func(*args, **kwargs)

        return wrapper

    return validate_dto

from flask import jsonify, request
from functools import wraps

from ..resources.create_user_dto import CreateUserDTO
from ..resources.entity_dto import EntityDTO
from ..resources.register_user_dto import RegisterUserDTO
from ..resources.update_user_dto import UpdateUserDTO

dtos = {
    "CreateUserDTO": CreateUserDTO,
    "EntityDTO": EntityDTO,
    "RegisterUserDTO": RegisterUserDTO,
    "UpdateUserDTO": UpdateUserDTO,
}


def validate_request(dto_class_name):
    """
    Determine if request is valid based on the types of the arguments passed in to create or update a dto

    :param dto_class_name: the class name to create or update dto
    :type dto_class_name: str
    """

    def validate_dto(api_func):
        @wraps(api_func)
        def wrapper(*args, **kwargs):
            dto = dtos[dto_class_name](**request.json)
            error_message = dto.validate()
            if error_message:
                return (
                    jsonify({"error": error_message}),
                    400,
                )
            return api_func(*args, **kwargs)

        return wrapper

    return validate_dto

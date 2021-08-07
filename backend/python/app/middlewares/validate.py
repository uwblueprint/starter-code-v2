from flask import jsonify, request
from functools import wraps
import json

from ..resources.create_user_dto import CreateUserDTO
from ..resources.entity_dto import EntityDTO
from ..resources.update_user_dto import UpdateUserDTO

dtos = {
    "CreateUserDTO": CreateUserDTO,
    "EntityDTO": EntityDTO,
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
            if request.content_type == "application/json":
                dto = dtos[dto_class_name](**request.json)
            else:
<<<<<<< HEAD
                req_body = request.form.get("body", default=None)
                if req_body is None:
                    return jsonify({"error": "Missing body"}), 400
                req = json.loads(req_body)
=======
                req = json.loads(request.form.get("body"))
>>>>>>> cf892e3124fec315da450f9154ae1bb2c4fe3bcf
                req["file"] = request.files.get("file", default=None)
                dto = dtos[dto_class_name](**req)
            error_message = dto.validate()
            if error_message:
                return (
                    jsonify({"error": error_message}),
                    400,
                )
            return api_func(*args, **kwargs)

        return wrapper

    return validate_dto

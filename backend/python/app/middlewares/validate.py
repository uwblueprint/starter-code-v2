from flask import jsonify, request
from functools import wraps
# file-storage {
import json

# } file-storage
# auth {
from ..resources.create_user_dto import CreateUserDTO
# } auth
from ..resources.entity_dto import EntityDTO
# auth {
from ..resources.update_user_dto import UpdateUserDTO
# } auth

dtos = {
    # auth {
    "CreateUserDTO": CreateUserDTO,
    # } auth
    "EntityDTO": EntityDTO,
    # auth {
    "UpdateUserDTO": UpdateUserDTO,
    # } auth
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
            # file-storage {
            if request.content_type == "application/json":
                dto = dtos[dto_class_name](**request.json)
            else:
                req_body = request.form.get("body", default=None)
                if req_body is None:
                    return jsonify({"error": "Missing body"}), 400
                req = json.loads(req_body)
                req["file"] = request.files.get("file", default=None)
                dto = dtos[dto_class_name](**req)
            # } file-storage
            # no-file-storage {
            dto = dtos[dto_class_name](**request.json)
            # } no-file-storage
            error_message = dto.validate()
            if error_message:
                return (
                    jsonify({"error": error_message}),
                    400,
                )
            return api_func(*args, **kwargs)

        return wrapper

    return validate_dto

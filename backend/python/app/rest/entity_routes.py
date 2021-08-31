from flask import Blueprint, current_app, request
from flask import jsonify
# file-storage {
import json
# } file-storage

from ..resources.entity_dto import EntityDTO

# auth {
from ..middlewares.auth import require_authorization_by_role
# } auth
from ..middlewares.validate import validate_request
from ..services.implementations.entity_service import EntityService
# file-storage {
from ..services.implementations.file_storage_service import FileStorageService
# } file-storage
from ..utilities.csv_utils import generate_csv_from_list

DEFAULT_CSV_OPTIONS = {
    "header": True,
    "flatten_lists": False,
    "flatten_objects": False,
}

# file-storage {
# define instance of FileStorageService
file_storage_service = FileStorageService(current_app.logger)

# define instance of EntityService
entity_service = EntityService(current_app.logger, file_storage_service)

# } file-storage
# no-file-storage {
# define instance of EntityService
entity_service = EntityService(current_app.logger)

# } no-file-storage
# defines a shared URL prefix for all routes
blueprint = Blueprint("entity", __name__, url_prefix="/entities")

# defines GET endpoint for retrieving all entities
@blueprint.route("/", methods=["GET"], strict_slashes=False)
# auth {
@require_authorization_by_role({"User", "Admin"})
# } auth
def get_entities():
    result = entity_service.get_entities()
    content_type = request.mimetype

    if content_type == "text/csv":
        return jsonify(generate_csv_from_list(result, **DEFAULT_CSV_OPTIONS)), 200

    return jsonify(result), 200


# postgresql {
# defines GET endpoint for retrieving a single entity based on a provided id
@blueprint.route("/<int:id>", methods=["GET"], strict_slashes=False)
# auth {
@require_authorization_by_role({"User", "Admin"})
# } auth
def get_entity(id):
    try:
        result = entity_service.get_entity(id)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    # HTTP status code 200 means OK
    return jsonify(result), 200


# define POST endpoint for creating an entity
@blueprint.route("/", methods=["POST"], strict_slashes=False)
# auth {
@require_authorization_by_role({"User", "Admin"})
# } auth
@validate_request("EntityDTO")
def create_entity():
    try:
        # create a EntityResource object instead of using the raw request body
        # data validators and transformations are applied when constructing the resource,
        # this allows downstream code to make safe assumptions about the data
        # file-storage {
        if request.content_type == "application/json":
            body = EntityDTO(**request.json)
        else:
            req = json.loads(request.form.get("body"))
            req["file"] = request.files.get("file", default=None)
            body = EntityDTO(**req)
        # } file-storage
        # no-file-storage {
        body = EntityDTO(**request.json)
        # } no-file-storage
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    # HTTP status code 201 means Created
    return jsonify(entity_service.create_entity(body)), 201


# defines PUT endpoint for updating the entity with the provided id
@blueprint.route("/<int:id>", methods=["PUT"], strict_slashes=False)
# auth {
@require_authorization_by_role({"User", "Admin"})
# } auth
@validate_request("EntityDTO")
def update_entity(id):
    try:
        # file-storage {
        if request.content_type == "application/json":
            body = EntityDTO(**request.json)
        else:
            req = json.loads(request.form.get("body"))
            req_file = request.files.get("file", default=None)
            body = EntityDTO(**req, file=req_file)
        # } file-storage
        # no-file-storage {
        body = EntityDTO(**request.json)
        # } no-file-storage
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    try:
        result = entity_service.update_entity(id, body)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify(result), 200


# defines DELETE endpoint for deleting the entity with the provided id
@blueprint.route("/<int:id>", methods=["DELETE"], strict_slashes=False)
# auth {
@require_authorization_by_role({"User", "Admin"})
# } auth
def delete_entity(id):
    try:
        result = entity_service.delete_entity(id)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify(result), 200

# } postgresql
# mongodb {
# defines GET endpoint for retrieving a single entity based on a provided id
@blueprint.route("/<string:id>", methods=["GET"], strict_slashes=False)
# auth {
@require_authorization_by_role({"User", "Admin"})
# } auth
def get_entity(id):
    try:
        result = entity_service.get_entity(id)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    # HTTP status code 200 means OK
    return jsonify(result), 200


# define POST endpoint for creating an entity
@blueprint.route("/", methods=["POST"], strict_slashes=False)
# auth {
@require_authorization_by_role({"User", "Admin"})
# } auth
@validate_request("EntityDTO")
def create_entity():
    try:
        # create a EntityResource object instead of using the raw request body
        # data validators and transformations are applied when constructing the resource,
        # this allows downstream code to make safe assumptions about the data
        # file-storage {
        if request.content_type == "application/json":
            body = EntityDTO(**request.json)
        else:
            req = json.loads(request.form.get("body"))
            req["file"] = request.files.get("file", default=None)
            body = EntityDTO(**req)
        # } file-storage
        # no-file-storage {
        body = EntityDTO(**request.json)
        # } no-file-storage
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    # HTTP status code 201 means Created
    return jsonify(entity_service.create_entity(body)), 201


# defines PUT endpoint for updating the entity with the provided id
@blueprint.route("/<string:id>", methods=["PUT"], strict_slashes=False)
# auth {
@require_authorization_by_role({"User", "Admin"})
# } auth
@validate_request("EntityDTO")
def update_entity(id):
    try:
        # file-storage {
        if request.content_type == "application/json":
            body = EntityDTO(**request.json)
        else:
            req = json.loads(request.form.get("body"))
            req["file"] = request.files.get("file", default=None)
            body = EntityDTO(**req)
        # } file-storage
        # no-file-storage {
        body = EntityDTO(**request.json)
        # } no-file-storage
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    try:
        result = entity_service.update_entity(id, body)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify(result), 200


# defines DELETE endpoint for deleting the entity with the provided id
@blueprint.route("/<string:id>", methods=["DELETE"], strict_slashes=False)
# auth {
@require_authorization_by_role({"User", "Admin"})
# } auth
def delete_entity(id):
    try:
        result = entity_service.delete_entity(id)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify(result), 200

# } mongodb

# file-storage {
# defines GET endpoint for a URL to the entity's file with the provided uuid
@blueprint.route("/files/<string:id>", methods=["GET"], strict_slashes=False)
# auth {
@require_authorization_by_role({"User", "Admin"})
# } auth
def get_file(id):
    try:
        file_url = file_storage_service.get_file(id)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify({"file_url": file_url}), 200
# } file-storage

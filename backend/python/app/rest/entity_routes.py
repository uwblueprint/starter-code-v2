from flask import Blueprint, current_app, request
from flask import jsonify
import json

from ..resources.entity_dto import EntityDTO

from ..middlewares.auth import require_authorization_by_role
from ..middlewares.validate import validate_request

# from ..services.implementations.entity_service import EntityService
from ..services.implementations.entity_service_mg import EntityService
from ..services.implementations.file_storage_service import FileStorageService

# define instance of EntityService
entity_service = EntityService(current_app.logger, FileStorageService(current_app.logger))

# defines a shared URL prefix for all routes
blueprint = Blueprint("entity", __name__, url_prefix="/entities")

# defines GET endpoint for retrieving all entities
@blueprint.route("/", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
def get_entities():
    result = entity_service.get_entities()
    return jsonify(result), 200


# POSTGRES
# # defines GET endpoint for retrieving a single entity based on a provided id
# @blueprint.route("/<int:id>", methods=["GET"], strict_slashes=False)
# @require_authorization_by_role({"User", "Admin"})
# def get_entity(id):
#     try:
#         result = entity_service.get_entity(id)
#     except Exception as e:
#         error_message = getattr(e, "message", None)
#         return jsonify({"error": (error_message if error_message else str(e))}), 500

#     # HTTP status code 200 means OK
#     return jsonify(result), 200

# MONGO
# defines GET endpoint for retrieving a single entity based on a provided id
@blueprint.route("/<string:id>", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
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
@require_authorization_by_role({"User", "Admin"})
@validate_request("EntityDTO")
def create_entity():
    file = None
    try:
        # create a EntityResource object instead of using the raw request body
        # data validators and transformations are applied when constructing the resource,
        # this allows downstream code to make safe assumptions about the data
        if request.content_type == "application/json":
            body = EntityDTO(**request.json)
        else:
            file = request.files.get('file', default=None)
            body = EntityDTO(**json.loads(request.form.get('body')))
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    # HTTP status code 201 means Created
    return jsonify(entity_service.create_entity(body, file)), 201


# POSTGRES
# # defines PUT endpoint for updating the entity with the provided id
# @blueprint.route("/<int:id>", methods=["PUT"], strict_slashes=False)
# @require_authorization_by_role({"User", "Admin"})
# def update_entity(id):
#     try:
#         body = EntityDTO(**request.json)
#     except Exception as e:
#         error_message = getattr(e, "message", None)
#         return jsonify({"error": (error_message if error_message else str(e))}), 500

#     try:
#         result = entity_service.update_entity(id, body)
#     except Exception as e:
#         error_message = getattr(e, "message", None)
#         return jsonify({"error": (error_message if error_message else str(e))}), 500

#     return jsonify(result), 200

# MONGO
# defines PUT endpoint for updating the entity with the provided id
@blueprint.route("/<string:id>", methods=["PUT"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
@validate_request("EntityDTO")
def update_entity(id):
    try:
        body = EntityDTO(**request.json)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    try:
        result = entity_service.update_entity(id, body)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify(result), 200


# POSTGRES
# # defines DELETE endpoint for deleting the entity with the provided id
# @blueprint.route("/<int:id>", methods=["DELETE"], strict_slashes=False)
# @require_authorization_by_role({"User", "Admin"})
# def delete_entity(id):
#     try:
#         result = entity_service.delete_entity(id)
#     except Exception as e:
#         error_message = getattr(e, "message", None)
#         return jsonify({"error": (error_message if error_message else str(e))}), 500

#     return jsonify(result), 200

# MONGO
# defines DELETE endpoint for deleting the entity with the provided id
@blueprint.route("/<string:id>", methods=["DELETE"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
def delete_entity(id):
    try:
        result = entity_service.delete_entity(id)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify(result), 200


# defines GET endpoint for a URL to the entity's file with the provided uuid
@blueprint.route("/files/<string:id>", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"user", "Admin"})
def get_file(id):
    try:
        file_url = FileStorageService.get_file(id)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify(file_url), 200

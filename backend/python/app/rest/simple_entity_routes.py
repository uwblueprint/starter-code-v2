from flask import Blueprint, current_app, request
from flask import jsonify

from ..resources.simple_entity_dto import SimpleEntityDTO

from ..middlewares.auth import require_authorization_by_role
from ..middlewares.validate import validate_request
from ..services.implementations.simple_entity_service import SimpleEntityService
from ..utilities.csv_utils import generate_csv_from_list

DEFAULT_CSV_OPTIONS = {
    "header": True,
    "flatten_lists": False,
    "flatten_objects": False,
}

# define instance of SimpleEntityService
simple_entity_service = SimpleEntityService(current_app.logger)

# defines a shared URL prefix for all routes
blueprint = Blueprint("simple_entity", __name__, url_prefix="/simpleEntities")

# defines GET endpoint for retrieving all simple entities
@blueprint.route("/", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
def get_simple_entities():
    result = simple_entity_service.get_entities()
    content_type = request.mimetype

    if content_type == "text/csv":
        return jsonify(generate_csv_from_list(result, **DEFAULT_CSV_OPTIONS)), 200

    return jsonify(result), 200


# postgresql {
# defines GET endpoint for retrieving a single simple entity based on a provided id
@blueprint.route("/<int:id>", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
def get_simple_entity(id):
    try:
        result = simple_entity_service.get_entity(id)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    # HTTP status code 200 means OK
    return jsonify(result), 200


# define POST endpoint for creating a simple entity
@blueprint.route("/", methods=["POST"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
@validate_request("SimpleEntityDTO")
def create_simple_entity():
    try:
        # create a SimpleEntityResource object instead of using the raw request body
        # data validators and transformations are applied when constructing the resource,
        # this allows downstream code to make safe assumptions about the data
        body = SimpleEntityDTO(**request.json)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    # HTTP status code 201 means Created
    return jsonify(simple_entity_service.create_entity(body)), 201


# defines PUT endpoint for updating the simple entity with the provided id
@blueprint.route("/<int:id>", methods=["PUT"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
@validate_request("SimpleEntityDTO")
def update_simple_entity(id):
    try:
        body = SimpleEntityDTO(**request.json)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    try:
        result = simple_entity_service.update_entity(id, body)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify(result), 200


# defines DELETE endpoint for deleting the simple entity with the provided id
@blueprint.route("/<int:id>", methods=["DELETE"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
def delete_simple_entity(id):
    try:
        result = simple_entity_service.delete_entity(id)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify(result), 200

# } postgresql
# mongodb {
# defines GET endpoint for retrieving a single simple entity based on a provided id
@blueprint.route("/<string:id>", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
def get_simple_entity(id):
    try:
        result = simple_entity_service.get_entity(id)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    # HTTP status code 200 means OK
    return jsonify(result), 200


# define POST endpoint for creating a simple entity
@blueprint.route("/", methods=["POST"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
@validate_request("SimpleEntityDTO")
def create_entity():
    try:
        # create a EntityResource object instead of using the raw request body
        # data validators and transformations are applied when constructing the resource,
        # this allows downstream code to make safe assumptions about the data
        body = SimpleEntityDTO(**request.json)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    # HTTP status code 201 means Created
    return jsonify(simple_entity_service.create_entity(body)), 201


# defines PUT endpoint for updating the simple entity with the provided id
@blueprint.route("/<string:id>", methods=["PUT"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
@validate_request("SimpleEntityDTO")
def update_simple_entity(id):
    try:
        body = SimpleEntityDTO(**request.json)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    try:
        result = simple_entity_service.update_entity(id, body)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify(result), 200


# defines DELETE endpoint for deleting the simple entity with the provided id
@blueprint.route("/<string:id>", methods=["DELETE"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
def delete_entity(id):
    try:
        result = simple_entity_service.delete_entity(id)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500

    return jsonify(result), 200

# } mongodb
from flask import Blueprint, request
from flask import jsonify

from ..resources.entity_dto import EntityDTO
from ..services import entity_service

# defines a shared URL prefix for all routes
blueprint = Blueprint("entity", __name__, url_prefix="/entities")

# defines GET endpoint for retrieving all entities
@blueprint.route("/", methods=["GET"], strict_slashes=False)
def get_entities():
    result = entity_service.get_entities()
    return jsonify(result), 200


# defines GET endpoint for retrieving a single entity based on a provided id
@blueprint.route("/<int:id>", methods=["GET"], strict_slashes=False)
def get_entity(id):
    try:
        result = entity_service.get_entity(id)
    except:
        error = {"error": "entity not found"}
        # HTTP status code 404 means Not Found
        return jsonify(error), 404

    # HTTP status code 200 means OK
    return jsonify(result), 200


# define POST endpoint for creating an entity
@blueprint.route("/", methods=["POST"], strict_slashes=False)
def create_entity():
    try:
        # create a EntityResource object instead of using the raw request body
        # data validators and transformations are applied when constructing the resource,
        # this allows downstream code to make safe assumptions about the data
        body = EntityDTO(**request.json)
    except Exception as error:
        error = {"error": str(error)}
        # HTTP status code 400 means Bad Request
        return jsonify(error), 400

    # HTTP status code 201 means Created
    return jsonify(entity_service.create_entity(body.__dict__)), 201


# defines PUT endpoint for updating the entity with the provided id
@blueprint.route("/<int:id>", methods=["PUT"], strict_slashes=False)
def update_entity(id):
    try:
        body = EntityDTO(**request.json)
    except Exception as error:
        error = {"error": str(error)}
        return jsonify(error), 400

    try:
        result = entity_service.update_entity(id, body.__dict__)
    except Exception as error:
        error = {"error": "entity not found"}
        return jsonify(error), 404

    return jsonify(result), 200


# defines DELETE endpoint for deleting the entity with the provided id
@blueprint.route("/<int:id>", methods=["DELETE"], strict_slashes=False)
def delete_entity(id):
    try:
        result = entity_service.delete_entity(id)
    except Exception as error:
        error = {"error": "entity not found"}
        return jsonify(error), 404

    return jsonify(result), 200

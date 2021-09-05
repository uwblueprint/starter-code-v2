import os

from flask import Blueprint, current_app, jsonify, request

from ..middlewares.auth import require_authorization_by_role
from ..middlewares.validate import validate_request
from ..resources.create_user_dto import CreateUserDTO
from ..resources.update_user_dto import UpdateUserDTO
from ..services.implementations.auth_service import AuthService
from ..services.implementations.email_service import EmailService
from ..services.implementations.user_service_mg import UserService
from ..utilities.csv_utils import generate_csv_from_list

user_service = UserService(current_app.logger)
email_service = EmailService(
    current_app.logger,
    {
        "refresh_token": os.getenv("EMAIL_REFRESH_TOKEN"),
        "token_uri": "https://oauth2.googleapis.com/token",
        "client_id": os.getenv("EMAIL_CLIENT_ID"),
        "client_secret": os.getenv("EMAIL_CLIENT_SECRET"),
    },
    "name@domain.org",  # must replace
    "Display Name",  # must replace
)
auth_service = AuthService(current_app.logger, user_service, email_service)
blueprint = Blueprint("users", __name__, url_prefix="/users")

DEFAULT_CSV_OPTIONS = {
    "header": True,
    "flatten_lists": True,
    "flatten_objects": False,
}


@blueprint.route("/", methods=["GET"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
def get_users():
    """
    Get all users, optionally filter by a user_id or email query parameter to retrieve a single user
    """
    user_id = request.args.get("user_id")
    email = request.args.get("email")
    content_type = request.mimetype

    if user_id and email:
        return jsonify({"error": "Cannot query by both user_id and email"}), 400

    if not (user_id or email):
        try:
            users = user_service.get_users()

            if content_type == "text/csv":
                return (
                    jsonify(
                        generate_csv_from_list(
                            [user.__dict__ for user in users], **DEFAULT_CSV_OPTIONS
                        )
                    ),
                    200,
                )

            return jsonify(list(map(lambda user: user.__dict__, users))), 200
        except Exception as e:
            error_message = getattr(e, "message", None)
            return jsonify({"error": (error_message if error_message else str(e))}), 500

    if user_id:
        if type(user_id) is not str:
            return jsonify({"error": "user_id query parameter must be a string"}), 400
        else:
            try:
                user = user_service.get_user_by_id(user_id)
                return jsonify(user.__dict__), 200
            except Exception as e:
                error_message = getattr(e, "message", None)
                return (
                    jsonify({"error": (error_message if error_message else str(e))}),
                    500,
                )

    if email:
        if type(email) is not str:
            return jsonify({"error": "email query parameter must be a string"}), 400
        else:
            try:
                user = user_service.get_user_by_email(email)
                return jsonify(user.__dict__), 200
            except Exception as e:
                error_message = getattr(e, "message", None)
                return (
                    jsonify({"error": (error_message if error_message else str(e))}),
                    500,
                )


@blueprint.route("/", methods=["POST"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
@validate_request("CreateUserDTO")
def create_user():
    """
    Create a user
    """
    try:
        user = CreateUserDTO(**request.json)
        created_user = user_service.create_user(user)
        auth_service.send_email_verification_link(request.json["email"])
        return jsonify(created_user.__dict__), 201
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/<string:user_id>", methods=["PUT"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
@validate_request("UpdateUserDTO")
def update_user(user_id):
    """
    Update the user with the specified user_id
    """
    try:
        user = UpdateUserDTO(**request.json)
        updated_user = user_service.update_user_by_id(user_id, user)
        return jsonify(updated_user.__dict__), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/", methods=["DELETE"], strict_slashes=False)
@require_authorization_by_role({"User", "Admin"})
def delete_user():
    """
    Delete a user by user_id or email, specified through a query parameter
    """
    user_id = request.args.get("user_id")
    email = request.args.get("email")

    if user_id and email:
        return jsonify({"error": "Cannot delete by both user_id and email"}), 400

    if user_id:
        if type(user_id) is not str:
            return jsonify({"error": "user_id query parameter must be a string"}), 400
        else:
            try:
                user_service.delete_user_by_id(user_id)
                return "", 204
            except Exception as e:
                error_message = getattr(e, "message", None)
                return (
                    jsonify({"error": (error_message if error_message else str(e))}),
                    500,
                )

    if email:
        if type(email) is not str:
            return jsonify({"error": "email query parameter must be a string"}), 400
        else:
            try:
                user_service.delete_user_by_email(email)
                return "", 204
            except Exception as e:
                error_message = getattr(e, "message", None)
                return (
                    jsonify({"error": (error_message if error_message else str(e))}),
                    500,
                )

    return (
        jsonify({"error": "Must supply one of user_id or email as query parameter."}),
        400,
    )

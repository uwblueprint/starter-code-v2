from flask import Blueprint, render_template

blueprint = Blueprint(
    "api", __name__, url_prefix="/api-docs", template_folder="../templates"
)


@blueprint.route("/", methods=["GET"], strict_slashes=False)
def get_docs():
    return render_template("swaggerui.html")

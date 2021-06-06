from flask import Blueprint, render_template

blueprint = Blueprint(
    "api", __name__, url_prefix="/api", template_folder="../templates"
)


@blueprint.route("/docs", methods=["GET"], strict_slashes=False)
def get_docs():
    print("sending docs")
    return render_template("swaggerui.html")

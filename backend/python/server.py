import os
from dotenv import load_dotenv

# note: VS Code's Python extension might falsely report an unresolved import
from app import create_app

if __name__ == "__main__":
    load_dotenv()

    config_name = os.getenv("FLASK_CONFIG") or "development"
    app = create_app(config_name)

    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 8080)))

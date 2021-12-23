import inflection
import os
import pytest
import requests
from dotenv import load_dotenv

load_dotenv()


def pytest_addoption(parser):
    parser.addoption("--lang", action="store", default="ts", choices=["ts", "python"])
    parser.addoption(
        "--api", action="store", default="rest", choices=["rest", "graphql"]
    )
    parser.addoption("--auth", action="store_true")
    parser.addoption("--fs", action="store_true")


@pytest.fixture(scope="session")
def lang(request):
    return request.config.getoption("--lang")


@pytest.fixture(scope="session")
def api(request):
    return request.config.getoption("--api")


@pytest.fixture(scope="session")
def auth(request):
    return request.config.getoption("--auth")


@pytest.fixture(scope="session")
def fs(request):
    return request.config.getoption("--fs")


@pytest.fixture(scope="session")
def backend_url():
    return os.getenv("TEST_SCRIPT_BACKEND_URL")


@pytest.fixture(scope="session")
def new_user_email():
    return os.getenv("TEST_SCRIPT_NEW_USER_EMAIL")


@pytest.fixture(scope="module")
def auth_user(backend_url, api, auth):
    if not auth:
        return {}
    if api == "rest":
        response = requests.post(
            f"{backend_url}/auth/login",
            json={
                "email": os.getenv("TEST_SCRIPT_EMAIL"),
                "password": os.getenv("TEST_SCRIPT_PASSWORD"),
            },
        )
        return response.json()
    else:
        query = """
        mutation($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                id
                firstName
                lastName
                email
                role
                accessToken
            }
        }
        """
        response = requests.post(
            f"{backend_url}/graphql",
            json={
                "query": query,
                "variables": {
                    "email": os.getenv("TEST_SCRIPT_EMAIL"),
                    "password": os.getenv("TEST_SCRIPT_PASSWORD"),
                },
            },
        )
        return response.json()["data"]["login"]


@pytest.fixture(scope="module")
def auth_header(auth_user, lang):
    if not auth_user:
        return {}
    accessTokenField = "accessToken"
    if lang != "ts":
        accessTokenField = inflection.underscore(accessTokenField)
    return {"Authorization": "Bearer " + auth_user[accessTokenField]}

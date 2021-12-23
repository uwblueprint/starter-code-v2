import inflection
import requests

from test_user import delete_user


def register_user(backend_url, body, access_token_field):
    response = requests.post(f"{backend_url}/auth/register", json=body)
    assert response.status_code == 200
    data = response.json()
    assert "role" in data
    assert data["role"] == "User"
    assert "id" in data
    assert access_token_field in data
    expected = {k: v for k, v in body.items() if k != "password"}
    actual = {k: v for k, v in data.items() if k in body}
    assert actual == expected
    return response.json()


def reset_password(backend_url, auth_header, email):
    response = requests.post(
        f"{backend_url}/auth/resetPassword/{email}",
        headers=auth_header,
    )
    assert response.status_code == 204


def logout(backend_url, auth_header, id):
    response = requests.post(
        f"{backend_url}/auth/logout/{id}",
        headers=auth_header,
    )
    assert response.status_code == 204


def test_auth(backend_url, auth_header, auth_user, lang, api, new_user_email):
    if not auth_header or api != "rest":
        return

    body = {
        "firstName": "Test",
        "lastName": "Script",
        "email": new_user_email,
        "password": "password123",
    }
    access_token_field = "accessToken"
    if lang != "ts":
        body = {inflection.underscore(k): v for k, v in body.items()}
        access_token_field = inflection.underscore(access_token_field)
    user = register_user(backend_url, body, access_token_field)
    delete_user(backend_url, auth_header, user["id"], lang)
    # Call the following with the auth user since we cannot verify emails on new users in the script
    reset_password(backend_url, auth_header, auth_user["email"])
    logout(backend_url, auth_header, auth_user["id"])

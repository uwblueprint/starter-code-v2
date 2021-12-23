import inflection
import requests

from test_user_gql import delete_user


def register_user(backend_url, body, access_token_field):
    query = """
    mutation($user: RegisterUserDTO!) {
        register(user: $user) {
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
        json={"query": query, "variables": {"user": body}},
    )
    assert "data" in response.json()
    assert "register" in response.json()["data"]
    data = response.json()["data"]["register"]
    assert "role" in data
    assert data["role"] == "User"
    assert "id" in data
    assert access_token_field in data
    expected = {k: v for k, v in body.items() if k != "password"}
    actual = {k: v for k, v in data.items() if k in body}
    assert actual == expected
    return data


def reset_password(backend_url, auth_header, email):
    query = """
    mutation($email: String!) {
        resetPassword(email: $email)
    }
    """
    response = requests.post(
        f"{backend_url}/graphql",
        json={"query": query, "variables": {"email": email}},
        headers=auth_header,
    )
    assert "data" in response.json()
    assert "resetPassword" in response.json()["data"]
    data = response.json()["data"]["resetPassword"]
    assert data
    return data


def logout(backend_url, auth_header, id):
    query = """
    mutation($userId: ID!) {
        logout(userId: $userId)
    }
    """
    response = requests.post(
        f"{backend_url}/graphql",
        json={"query": query, "variables": {"userId": id}},
        headers=auth_header,
    )
    assert "data" in response.json()
    assert "logout" in response.json()["data"]
    return response.json()["data"]["logout"]


def test_auth_gql(backend_url, auth_header, auth_user, lang, api, new_user_email):
    if not auth_header or api == "rest":
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
    delete_user(backend_url, auth_header, user["id"])
    # Call the following with the auth user since we cannot verify emails on new users in the script
    reset_password(backend_url, auth_header, auth_user["email"])
    logout(backend_url, auth_header, auth_user["id"])

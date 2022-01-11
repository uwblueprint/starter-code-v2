import inflection
import requests


def get_users(backend_url, auth_header):
    response = requests.get(f"{backend_url}/users", headers=auth_header)
    assert response.status_code == 200
    return response.json()


def get_user_by_id(backend_url, auth_header, id, lang):
    if lang == "ts":
        response = requests.get(
            f"{backend_url}/users?userId={id}",
            headers=auth_header,
        )
    else:
        response = requests.get(
            f"{backend_url}/users?user_id={id}",
            headers=auth_header,
        )
    assert response.status_code == 200
    return response.json()


def get_user_by_email(backend_url, auth_header, email):
    response = requests.get(
        f"{backend_url}/users?email={email}",
        headers=auth_header,
    )
    assert response.status_code == 200
    return response.json()


def create_user(backend_url, auth_header, body):
    response = requests.post(
        f"{backend_url}/users/",
        json=body,
        headers=auth_header,
    )
    assert response.status_code == 201
    data = response.json()
    expected = {k: v for k, v in body.items() if k != "password"}
    actual = {k: v for k, v in data.items() if k in body}
    assert actual == expected
    return data


def update_user(backend_url, auth_header, id, body):
    response = requests.put(
        f"{backend_url}/users/{id}",
        json=body,
        headers=auth_header,
    )
    assert response.status_code == 200
    data = response.json()
    actual = {k: v for k, v in data.items() if k in body}
    assert actual == body
    return data


def delete_user(backend_url, auth_header, id, lang):
    if lang == "ts":
        response = requests.delete(
            f"{backend_url}/users?userId={id}",
            headers=auth_header,
        )
    else:
        response = requests.delete(
            f"{backend_url}/users?user_id={id}",
            headers=auth_header,
        )
    assert response.status_code == 204


def test_users(backend_url, auth_header, lang, api, new_user_email):
    if not auth_header or api != "rest":
        return

    body1 = {
        "firstName": "Test",
        "lastName": "Script",
        "role": "User",
        "email": new_user_email,
        "password": "password",
    }
    body2 = {
        "firstName": "Test2",
        "lastName": "Script2",
        "role": "User",
        "email": new_user_email,
    }
    if lang != "ts":
        body1 = {inflection.underscore(k): v for k, v in body1.items()}
        body2 = {inflection.underscore(k): v for k, v in body2.items()}

    user = create_user(backend_url, auth_header, body1)
    updated_user = update_user(backend_url, auth_header, user["id"], body2)
    retrieved_user_by_id = get_user_by_id(backend_url, auth_header, user["id"], lang)
    assert updated_user == retrieved_user_by_id
    retrieved_user_by_email = get_user_by_email(
        backend_url, auth_header, updated_user["email"]
    )
    assert updated_user == retrieved_user_by_email
    assert get_users(backend_url, auth_header)
    delete_user(backend_url, auth_header, user["id"], lang)

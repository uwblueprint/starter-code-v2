import inflection
import json
import requests


def get_entities(backend_url, auth_header):
    response = requests.get(f"{backend_url}/entities", headers=auth_header)
    assert response.status_code == 200
    return response.json()


def get_entity_by_id(backend_url, auth_header, id):
    response = requests.get(
        f"{backend_url}/entities/{id}",
        headers=auth_header,
    )
    assert response.status_code == 200
    return response.json()


def get_file(backend_url, auth_header, filename):
    response = requests.get(
        f"{backend_url}/entities/files/{filename}",
        headers=auth_header,
    )
    assert response.status_code == 200
    return response.json()


def create_entity(backend_url, auth_header, body, fs, file, filename_field):
    if fs:
        response = requests.post(
            f"{backend_url}/entities/",
            headers=auth_header,
            files={"file": file},
            data={"body": json.dumps(body)},
        )
    else:
        response = requests.post(
            f"{backend_url}/entities/",
            json=body,
            headers=auth_header,
        )
    assert response.status_code == 201
    data = response.json()
    if fs:
        assert filename_field in data
    actual = {k: v for k, v in data.items() if k in body}
    assert actual == body
    return data


def update_entity(backend_url, auth_header, id, body, fs, file, filename_field):
    if fs:
        response = requests.put(
            f"{backend_url}/entities/{id}",
            headers=auth_header,
            files={"file": file},
            data={"body": json.dumps(body)},
        )
    else:
        response = requests.put(
            f"{backend_url}/entities/{id}",
            json=body,
            headers=auth_header,
        )
    assert response.status_code == 200
    data = response.json()
    if fs:
        assert filename_field in data
    actual = {k: v for k, v in data.items() if k in body}
    assert actual == body
    return data


def delete_entity(backend_url, auth_header, id):
    response = requests.delete(
        f"{backend_url}/entities/{id}",
        headers=auth_header,
    )
    assert response.status_code == 200


def test_entities(backend_url, auth_header, lang, api, fs):
    if api != "rest":
        return

    body1 = {
        "stringField": "TestScript1",
        "intField": 1,
        "enumField": "A",
        "stringArrayField": ["test1", "test2"],
        "boolField": True,
    }
    body2 = {
        "stringField": "TestScript2",
        "intField": 2,
        "enumField": "B",
        "stringArrayField": ["test2"],
        "boolField": False,
    }
    filename_field = "fileName"
    if lang != "ts":
        body1 = {inflection.underscore(k): v for k, v in body1.items()}
        body2 = {inflection.underscore(k): v for k, v in body2.items()}
        filename_field = inflection.underscore(filename_field)
    file1 = ("dog.jpg", open("dog.jpg", "rb"), "image/jpeg")
    file2 = ("cat.png", open("cat.png", "rb"), "image/png")

    entity = create_entity(backend_url, auth_header, body1, fs, file1, filename_field)
    if fs:
        get_file(backend_url, auth_header, entity[filename_field])
    updated_entity = update_entity(
        backend_url, auth_header, entity["id"], body2, fs, file2, filename_field
    )
    if fs:
        get_file(backend_url, auth_header, updated_entity[filename_field])
    retrieved_entity = get_entity_by_id(backend_url, auth_header, entity["id"])
    assert updated_entity == retrieved_entity
    assert get_entities(backend_url, auth_header)
    delete_entity(backend_url, auth_header, entity["id"])

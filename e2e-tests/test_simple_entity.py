import inflection
import requests


def get_entities(backend_url, auth_header):
    response = requests.get(f"{backend_url}/simpleEntities", headers=auth_header)
    assert response.status_code == 200
    return response.json()


def get_entity_by_id(backend_url, auth_header, id):
    response = requests.get(
        f"{backend_url}/simpleEntities/{id}",
        headers=auth_header,
    )
    assert response.status_code == 200
    return response.json()


def create_entity(backend_url, auth_header, body):
    response = requests.post(
        f"{backend_url}/simpleEntities/",
        json=body,
        headers=auth_header,
    )
    assert response.status_code == 201
    data = response.json()
    actual = {k: v for k, v in data.items() if k in body}
    assert actual == body
    return data


def update_entity(backend_url, auth_header, id, body):
    response = requests.put(
        f"{backend_url}/simpleEntities/{id}",
        json=body,
        headers=auth_header,
    )
    assert response.status_code == 200
    data = response.json()
    actual = {k: v for k, v in data.items() if k in body}
    assert actual == body
    return data


def delete_entity(backend_url, auth_header, id):
    response = requests.delete(
        f"{backend_url}/simpleEntities/{id}",
        headers=auth_header,
    )
    assert response.status_code == 200


def test_simple_entities(backend_url, auth_header, lang, api):
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
    if lang != "ts":
        body1 = {inflection.underscore(k): v for k, v in body1.items()}
        body2 = {inflection.underscore(k): v for k, v in body2.items()}

    entity = create_entity(backend_url, auth_header, body1)
    updated_entity = update_entity(backend_url, auth_header, entity["id"], body2)
    retrieved_entity = get_entity_by_id(backend_url, auth_header, entity["id"])
    assert updated_entity == retrieved_entity
    assert get_entities(backend_url, auth_header)
    delete_entity(backend_url, auth_header, entity["id"])

import inflection
import requests


def get_entities(backend_url, auth_header):
    query = """
    query {
        simpleEntities {
            id
            stringField
            intField
            enumField
            stringArrayField
            boolField
        }
    }
    """
    response = requests.post(
        f"{backend_url}/graphql",
        json={"query": query},
        headers=auth_header,
    )
    assert "data" in response.json()
    assert "simpleEntities" in response.json()["data"]
    return response.json()["data"]["simpleEntities"]


def get_entity_by_id(backend_url, auth_header, id):
    query = """
    query($id: ID!) {
        simpleEntity(id: $id) {
            id
            stringField
            intField
            enumField
            stringArrayField
            boolField
        }
    }
    """
    response = requests.post(
        f"{backend_url}/graphql",
        json={"query": query, "variables": {"id": id}},
        headers=auth_header,
    )
    assert "data" in response.json()
    assert "simpleEntity" in response.json()["data"]
    return response.json()["data"]["simpleEntity"]


def create_entity(backend_url, auth_header, body):
    query = """
    mutation($entity: SimpleEntityRequestDTO!) {
        createSimpleEntity(entity: $entity) {
            id
            stringField
            intField
            stringArrayField
            boolField
            enumField
        }
    }      
    """
    response = requests.post(
        f"{backend_url}/graphql",
        json={"query": query, "variables": {"entity": body}},
        headers=auth_header,
    )
    assert "data" in response.json()
    assert "createSimpleEntity" in response.json()["data"]
    data = response.json()["data"]["createSimpleEntity"]
    actual = {k: v for k, v in data.items() if k in body}
    assert actual == body
    return data


def update_entity(backend_url, auth_header, id, body):
    query = """
    mutation($id: ID!, $entity: SimpleEntityRequestDTO!) {
        updateSimpleEntity(
            id: $id, entity: $entity
        ) {
            id
            stringField
            intField
            stringArrayField
            boolField
            enumField
        }
    }
    """
    response = requests.post(
        f"{backend_url}/graphql",
        json={"query": query, "variables": {"id": id, "entity": body}},
        headers=auth_header,
    )
    assert "data" in response.json()
    assert "updateSimpleEntity" in response.json()["data"]
    data = response.json()["data"]["updateSimpleEntity"]
    actual = {k: v for k, v in data.items() if k in body}
    assert actual == body
    return data


def delete_entity(backend_url, auth_header, id):
    query = """
    mutation($id: ID!) {
        deleteSimpleEntity(id: $id)
    }
    """
    response = requests.post(
        f"{backend_url}/graphql",
        json={"query": query, "variables": {"id": id}},
        headers=auth_header,
    )
    assert "data" in response.json()
    assert "deleteSimpleEntity" in response.json()["data"]
    data = response.json()["data"]["deleteSimpleEntity"]
    assert data == id
    return data


def test_entities_gql(backend_url, auth_header, lang, api):
    if api == "rest":
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

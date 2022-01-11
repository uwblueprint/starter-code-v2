import inflection
import json
import requests


def get_entities(backend_url, auth_header, fs):
    if fs:
        query = """
        query {
            entities {
                id
                stringField
                intField
                enumField
                stringArrayField
                boolField
                fileName
            }
        }
        """
    else:
        query = """
        query {
            entities {
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
    assert "entities" in response.json()["data"]
    return response.json()["data"]["entities"]


def get_entity_by_id(backend_url, auth_header, id, fs):
    if fs:
        query = """
        query($id: ID!) {
            entity(id: $id) {
                id
                stringField
                intField
                enumField
                stringArrayField
                boolField
                fileName
            }
        }
        """
    else:
        query = """
        query($id: ID!) {
            entity(id: $id) {
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
    assert "entity" in response.json()["data"]
    return response.json()["data"]["entity"]


def get_file(backend_url, auth_header, filename):
    query = """
    query($fileUUID: ID!) {
        file(fileUUID: $fileUUID)
    }
    """
    response = requests.post(
        f"{backend_url}/graphql",
        json={"query": query, "variables": {"fileUUID": filename}},
        headers=auth_header,
    )
    assert "data" in response.json()
    assert "file" in response.json()["data"]
    return response.json()["data"]["file"]


def create_entity(backend_url, auth_header, body, fs, file, filename_field):
    if fs:
        query = """
        mutation($entity: EntityRequestDTO!, $file: Upload) {
            createEntity(
                entity: $entity, file: $file
            ) {
                id
                stringField
                intField
                stringArrayField
                boolField
                enumField
                fileName
            }
        }        
        """
        # https://github.com/jaydenseric/graphql-multipart-request-spec
        operations = json.dumps(
            {
                "query": query,
                "variables": {"entity": body, "file": None},
            }
        )
        map = json.dumps({"0": ["variables.file"]})
        response = requests.post(
            f"{backend_url}/graphql",
            data={"operations": operations, "map": map},
            files={"0": file},
            headers=auth_header,
        )
    else:
        query = """
        mutation($entity: EntityRequestDTO!) {
            createEntity(entity: $entity) {
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
    assert "createEntity" in response.json()["data"]
    data = response.json()["data"]["createEntity"]
    if fs:
        assert filename_field in data
    actual = {k: v for k, v in data.items() if k in body}
    assert actual == body
    return data


def update_entity(backend_url, auth_header, id, body, fs, file, filename_field):
    if fs:
        query = """
        mutation($id: ID!, $entity: EntityRequestDTO!, $file: Upload) {
            updateEntity(
                id: $id, entity: $entity, file: $file
            ) {
                id
                stringField
                intField
                stringArrayField
                boolField
                enumField
                fileName
            }
        }
        """
        # https://github.com/jaydenseric/graphql-multipart-request-spec
        operations = json.dumps(
            {
                "query": query,
                "variables": {"id": id, "entity": body, "file": None},
            }
        )
        map = json.dumps({"0": ["variables.file"]})
        response = requests.post(
            f"{backend_url}/graphql",
            data={"operations": operations, "map": map},
            files={"0": file},
            headers=auth_header,
        )
    else:
        query = """
        mutation($id: ID!, $entity: EntityRequestDTO!) {
            updateEntity(
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
    assert "updateEntity" in response.json()["data"]
    data = response.json()["data"]["updateEntity"]
    if fs:
        assert filename_field in data
    actual = {k: v for k, v in data.items() if k in body}
    assert actual == body
    return data


def delete_entity(backend_url, auth_header, id):
    query = """
    mutation($id: ID!) {
        deleteEntity(id: $id)
    }
    """
    response = requests.post(
        f"{backend_url}/graphql",
        json={"query": query, "variables": {"id": id}},
        headers=auth_header,
    )
    assert "data" in response.json()
    assert "deleteEntity" in response.json()["data"]
    data = response.json()["data"]["deleteEntity"]
    assert data == id
    return data


def test_entities_gql(backend_url, auth_header, lang, api, fs):
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
    retrieved_entity = get_entity_by_id(backend_url, auth_header, entity["id"], fs)
    assert updated_entity == retrieved_entity
    assert get_entities(backend_url, auth_header, fs)
    delete_entity(backend_url, auth_header, entity["id"])

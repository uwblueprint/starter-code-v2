---
layout: default
title: Testing CRUD (API Docs)
nav_order: 3
parent: CRUD
---

# Testing CRUD (API Documentation)
{:.no_toc}

The easiest way to test CRUD is to use either the REST or GraphQL entities endpoints. Suggested tools include Postman, Insomnia, or cURL for REST, and the GraphQL playground (http://localhost:5000/graphql) or Altair for GraphQL. You can also choose to test through the frontend, which calls a large subset of these endpoints.

Note that an access token must be provided for these endpoints as an Authorization header (either User or Admin roles work).

**Important**: Please use snake_case for all request body field names and URL parameters if using a Python backend, and camelCase if using a TypeScript backend (e.g. `user_id` if using Python and `userId` if using TypeScript)
{: .banner-info .mb-6 }

* TOC
{:toc}

## REST

### Create Entity: POST /entities
If opted **out** of file storage:
```
Request Header:
Authorization: Bearer <insert-access-token>

Request Body:
{
    "stringField": <string-field>,
    "intField": <int-field>,
    "enumField": "A" | "B" | "C" | "D",
    "stringArrayField": [<string-field>],
    "boolField": <bool-field>
}

Response Body:
{
    "id": <id>
    "stringField": <string-field>,
    "intField": <int-field>,
    "enumField": "A" | "B" | "C" | "D",
    "stringArrayField": [<string-field>],
    "boolField": <bool-field>
}
```

If opted **in** to file storage:
```
Request Header:
Authorization: Bearer <insert-access-token>
Content-Type: multipart/form-data

Request Body:
body: stringified form of
{
    "stringField": <string-field>,
    "intField": <int-field>,
    "enumField": "A" | "B" | "C" | "D",
    "stringArrayField": [<string-field>],
    "boolField": <bool-field>
}
file: <insert-file> // optional

Response Body:
{
    "id": <id>
    "stringField": <string-field>,
    "intField": <int-field>,
    "enumField": "A" | "B" | "C" | "D",
    "stringArrayField": [<string-field>],
    "boolField": <bool-field>
    "fileName": <file-name>
}
```

### Get Entities: GET /entities
Specify `text/csv` as the `Content-Type` header to receive the response in CSV format.
Note: starter code mistakenly used `Content-Type` instead of `Accept`, which is the more suitable header to use for this case. You should change it to `Accept` :)

```
Request Header:
Authorization: Bearer <insert-access-token>
Content-Type: text/csv OR application/json (default is application/json)

Response Body:
[
    {
        "id": <id>
        "stringField": <string-field>,
        "intField": <int-field>,
        "enumField": "A" | "B" | "C" | "D",
        "stringArrayField": [<string-field>],
        "boolField": <bool-field>,
        "fileName": <file-name> // optional, depends on if file storage is enabled and if a file is present
    },
    ...,
    {
        "id": <id>
        "stringField": <string-field>,
        "intField": <int-field>,
        "enumField": "A" | "B" | "C" | "D",
        "stringArrayField": [<string-field>],
        "boolField": <bool-field>,
        "fileName": <file-name> // optional, depends on if file storage is enabled and if a file is present
    }
]
```

### Get Entity: GET /entities/<insert-id\>
```
Request Header:
Authorization: Bearer <insert-access-token>

Response Body:
{
    "id": <id>
    "stringField": <string-field>,
    "intField": <int-field>,
    "enumField": "A" | "B" | "C" | "D",
    "stringArrayField": [<string-field>],
    "boolField": <bool-field>,
    "fileName": <file-name> // optional, depends on if file storage is enabled and if a file is present
}
```

### Get Entity's File: GET /entities/file/<insert-file-name\>
Available only if opted into file storage. The file name parameter is a UUID corresponding to the `fileName` field of the associated entity.
```
Request Header:
Authorization: Bearer <insert-access-token>

Response Body:
{
    "fileURL": <signed-url-to-file>
}
```

### Update Entity: PUT /entities/<insert-id\>
If opted **out** of file storage:
```
Request Header:
Authorization: Bearer <insert-access-token>

Request Body:
{
    "stringField": <string-field>,
    "intField": <int-field>,
    "enumField": "A" | "B" | "C" | "D",
    "stringArrayField": [<string-field>],
    "boolField": <bool-field>
}

Response Body:
{
    "id": <id>
    "stringField": <string-field>,
    "intField": <int-field>,
    "enumField": "A" | "B" | "C" | "D",
    "stringArrayField": [<string-field>],
    "boolField": <bool-field>
}
```

If opted **in** to file storage (since this is a PUT request, the previous entity is **completely replaced**, meaning that if the original entity had an associated file but you do not supply a file in the PUT request, the updated entity will not have an associated file):
```
Request Header:
Authorization: Bearer <insert-access-token>
Content-Type: multipart/form-data

Request Body:
body: stringified form of
{
    "stringField": <string-field>,
    "intField": <int-field>,
    "enumField": "A" | "B" | "C" | "D",
    "stringArrayField": [<string-field>],
    "boolField": <bool-field>
}
file: <insert-file> // optional

Response Body:
{
    "id": <id>
    "stringField": <string-field>,
    "intField": <int-field>,
    "enumField": "A" | "B" | "C" | "D",
    "stringArrayField": [<string-field>],
    "boolField": <bool-field>
    "fileName": <file-name>
}
```

### Delete Entity: DELETE /entities/<insert-id\>
```
Request Header:
Authorization: Bearer <insert-access-token>

Response:
204 No Content
```

## GraphQL

Note: accessToken must be supplied as an Authorization header for all requests below. To send a file with GraphQL, use the [Altair GraphQL Client](https://altair.sirmuel.design).

### Create Entity
If opted **out** of file storage:
```graphql
mutation {
  createEntity(entity: {
    stringField: "test",
    intField: 1,
    enumField: A | B | C | D,
    stringArrayField: ["A"],
    boolField: true
  }) {
    id
    stringField
    intField
    enumField
    stringArrayField
    boolField
  }
}
```

If opted **in** to file storage:
```graphql
mutation($file: Upload) {
  createEntity(entity: {
    stringField: "test",
    intField: 1,
    enumField: A,
    stringArrayField: ["A"],
    boolField:  true
  }, file: $file) {
    id
    stringField
    intField
    enumField
    stringArrayField
    boolField
    fileName
  }
}
```

### Get Entities
```graphql
query {
  entities {
    id
    stringField
    intField
    enumField
    stringArrayField
    boolField
    fileName # available if file storage is enabled
  }
}
```

### Get Entities CSV
```graphql
query {
  entitiesCSV
}
```

### Get Entity
```graphql
query {
  entity(id: "1") {
    id
    stringField
    intField
    enumField
    stringArrayField
    boolField
    fileName # available if file storage is enabled
  }
}
```

### Get Entity's File
Available only if opted into file storage. The file name parameter is a UUID corresponding to the `fileName` field of the associated entity.
```graphql
query {
   file(fileUUID: "FILE_UUID_NAME")
}
```

### Update Entity
If opted **out** of file storage:
```graphql
mutation {
  updateEntity(
    id: "1",
    entity: {
      stringField: "updated test",
      intField: 1,
      enumField: A | B | C | D,
      stringArrayField: ["A"],
      boolField: false
    }) {
    id
    stringField
    intField
    enumField
    stringArrayField
    boolField
  }
}
```

If opted **in** to file storage:
```graphql
mutation($file: Upload) {
  updateEntity(
    id: 1,
    entity: {
      stringField: "updated test", 
      intField: 2,
      enumField: A,
      stringArrayField: ["B"],
      boolField: true
    }, file: $file) {
    id
    stringField
    intField
    boolField
    enumField
    stringArrayField
    fileName
  }
}
```

### Delete Entity
```graphql
mutation {
  deleteEntity(id: "1")
}
```

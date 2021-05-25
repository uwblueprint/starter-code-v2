---
layout: default
title: Testing CRUD (API Docs)
nav_order: 3
parent: CRUD
---

# Testing CRUD (API Documentation)
{:.no_toc}

The easiest way to test CRUD is to use either the REST or GraphQL entities endpoints. Suggested tools include Postman, Insomnia, or cURL for REST, and the GraphQL playground (http://localhost:5000/graphql) for GraphQL. You can also choose to test through the frontend, which calls a large subset of these endpoints.

Note that an access token must be provided for these endpoints as an Authorization header (either User or Admin roles work).

**Important**: Please use snake_case for all request body field names and URL parameters if using a Python backend, and camelCase if using a TypeScript backend (e.g. `user_id` if using Python and `userId` if using TypeScript)
{: .banner-info .mb-6 }

* TOC
{:toc}

## REST

### Create Entity: POST /entities
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

### Get Entities: GET /entities
```
Request Header:
Authorization: Bearer <insert-access-token>

Response Body:
[
    {
        "id": <id>
        "stringField": <string-field>,
        "intField": <int-field>,
        "enumField": "A" | "B" | "C" | "D",
        "stringArrayField": [<string-field>],
        "boolField": <bool-field>
    },
    ...,
    {
        "id": <id>
        "stringField": <string-field>,
        "intField": <int-field>,
        "enumField": "A" | "B" | "C" | "D",
        "stringArrayField": [<string-field>],
        "boolField": <bool-field>
    }
]
```

### Get Entities: GET /entities/<insert-id\>
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
    "boolField": <bool-field>
}
```

### Update Entity: PUT /entities/<insert-id\>
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

### Delete Entity: DELETE /entities/<insert-id\>
```
Request Header:
Authorization: Bearer <insert-access-token>

Response:
204 No Content
```

## GraphQL

Note: accessToken must be supplied as an Authorization header for all requests below

### Create Entity
```graphql
mutation {
  createEntity(entity: {stringField: "test", intField: 1, enumField: A | B | C | D, stringArrayField: ["A"], boolField: true}) {
    id
    stringField
    intField
    enumField
    stringArrayField
    boolField
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
  }
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
  }
}
```

### Update Entity
```graphql
mutation {
  updateEntity(id: "1", entity: {stringField: "updated test", intField: 1, enumField: A | B | C | D, stringArrayField: ["A"], boolField: false}) {
    id
    stringField
    intField
    enumField
    stringArrayField
    boolField
  }
}
```

### Delete Entity
```graphql
mutation {
  deleteEntity(id: "1")
}
```

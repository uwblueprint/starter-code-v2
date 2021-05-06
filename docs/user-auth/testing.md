---
layout: default
title: Testing User Auth (API Docs)
nav_order: 5
parent: User Auth
---

# Testing User Auth (API Documentation)
{:.no_toc}

The easiest way to test user auth is to use either the REST or GraphQL endpoints. Suggested tools include Postman, Insomnia, or cURL for REST, and the GraphQL playground (http://localhost:5000/graphql) for GraphQL. You can also choose to test through the frontend, which calls a subset of these endpoints.

Note that only Admin users can access user endpoints, and that emails of created users must be unique.

* TOC
{:toc}

## REST

### Login: POST /auth/login
```
Request Body:
{
    "email": <user-email>,
    "password": <user-password>
}

Response Header:
Set-Cookie: refreshToken=<insert-refresh-token>; HttpOnly; SameSite=Strict (prod will also have Secure flag)

Response Body:
{
    "accessToken": <insert-access-token>,
    "id": <insert-user-id>,
    "email": <insert-email>,
    "firstName": <insert-first-name>,
    "lastName": <insert-last-name>,
    "role": <insert-user-role>
}
```

### Create User: POST /users
```
Request Header:
Authorization: Bearer <insert-access-token>

Request Body:
{
    "firstName": "First",
    "lastName": "Last",
    "role": "User",
    "email": "test@example.org",
    "password": "password123"
}

Response Body:
{
    "id": <insert-user-id>,
    "firstName": "First",
    "lastName": "Last",
    "role": "User",
    "email": "test@example.org"
}
```

### Update User: PUT /users/<insert-user-id\>
```
Request Header:
Authorization: Bearer <insert-access-token>

Request Body:
{
    "firstName": "Updated First",
    "lastName": "Updated Last",
    "role": "User",
    "email": "updatedtest@example.org"
}

Response Body:
{
    "id": <insert-user-id>,
    "firstName": "First",
    "lastName": "Last",
    "role": "User",
    "email": "test@example.org"
}
```

### Get Users: GET /users
```
Request Header:
Authorization: Bearer <insert-access-token>

Response Body:
[
    {
        "id": <insert-user-id>,
        "firstName": "First",
        "lastName": "Last",
        "role": "User",
        "email": "test@example.org"
    },
    ...,
    {
        "id": <insert-user-id>,
        "firstName": "First",
        "lastName": "Last",
        "role": "User",
        "email": "othertest@example.org"
    }
]
```

### Get Users: GET /users?userId=<insert-user-id\>
Note: the query parameter is `userId` if using TypeScript backend, and `user_id` if using Python backend

```
Request Header:
Authorization: Bearer <insert-access-token>

Response Body:
{
    "id": <insert-user-id>,
    "firstName": "First",
    "lastName": "Last",
    "role": "User",
    "email": "test@example.org"
}
```

### Get Users: GET /users?email=<insert-user-email\>
```
Request Header:
Authorization: Bearer <insert-access-token>

Response Body:
{
    "id": <insert-user-id>,
    "firstName": "First",
    "lastName": "Last",
    "role": "User",
    "email": "test@example.org"
}
```

### Delete Users: DELETE /users?userId=<insert-user-id\>
Note: the query parameter is `userId` if using TypeScript backend, and `user_id` if using Python backend

```
Request Header:
Authorization: Bearer <insert-access-token>

Response:
204 No Content
```

### Delete Users: DELETE /users?email=<insert-user-email\>
```
Request Header:
Authorization: Bearer <insert-access-token>

Response:
204 No Content
```

### Refresh Token: POST /auth/refresh
```
Request Header:
Cookie: refreshToken=<insert-refresh-token>

Response Header:
Set-Cookie: refreshToken=<insert-refresh-token>; HttpOnly; SameSite=Strict

Response Body:
{
    "accessToken": <insert-access-token>
}
```

### Reset Password: POST /auth/resetPassword/<insert-user-email\>
```
Request Header:
Authorization: Bearer <insert-access-token>

Response:
204 No Content
```

### Logout: POST /auth/logout/<insert-user-id\>
```
Request Header:
Authorization: Bearer <insert-access-token>

Response:
204 No Content
```

## GraphQL

### Login
```graphql
mutation {
  login(email: "user@domain.org", password: "password") {
      accessToken
      id
      firstName
      lastName
      email
      role
  }
}
```

Note: accessToken must be supplied as an Authorization header for all requests below (except `refresh`).

### Create User
```graphql
mutation {
  createUser(user: {firstName: "First", lastName: "Last", email: "test@domain.org", role: User, password: "password123"}) {
    id
    firstName
    lastName
    email
    role
  }
}
```

### Update User
```graphql
mutation {
  updateUser(id: "<insert-id>", user: {firstName: "Updated First", lastName: "Updated Last", email: "updated@domain.com", role: User}) {
    id
    firstName
    lastName
    email
    role
  }
}
```

### Get Users
```graphql
query {
  users {
    id
    firstName
    lastName
    role
    email
  }
}
```

### Get User by ID
```graphql
query {
  userById(id: "<insert-id>") {
    id
    firstName
    lastName
    role
    email
  }
}
```

### Get User by Email
```graphql
query {
  userByEmail(email: "<insert-email>") {
    id
    firstName
    lastName
    role
    email
  }
}
```

### Delete User by ID
```graphql
mutation {
  deleteUserById(id: "insert-id")
}
```

### Delete User by Email
```graphql
mutation {
  deleteUserByEmail(email: "insert-email")
}
```

### Refresh Token
```graphql
mutation {
  refresh
}
```

### Reset Password
```graphql
mutation {
  resetPassword(email: "insert-email")
}
```

### Logout
```graphql
mutation {
  logout(userId: "insert-id")
}
```

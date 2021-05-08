---
layout: default
title: Testing CRUD (API Docs)
nav_order: 3
parent: CRUD
---

# Testing CRUD (API Documentation)

The easiest way to test CRUD is to use either the REST or GraphQL entities endpoints. Suggested tools include Postman, Insomnia, or cURL for REST, and the GraphQL playground (http://localhost:5000/graphql) for GraphQL. You can also choose to test through the frontend, which calls a large subset of these endpoints.

Note that an access token must be provided for these endpoints as an Authorization header (either User or Admin roles work).

**Important**: Please use snake_case for all request body field names and URL parameters if using a Python backend, and camelCase if using a TypeScript backend (e.g. `user_id` if using Python and `userId` if using TypeScript)
{: .banner-info .mb-6 }

API docs coming soon, thank you for your patience! 🙏

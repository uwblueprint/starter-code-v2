---
layout: default
title: User Auth
nav_order: 3
has_children: true
---

# User Auth
{:.no_toc}

Starter Code comes with `UserService` and `AuthService` pre-built for your use if you opted into user auth through the CLI. `UserService` provides basic CRUD methods for you app's users, and `AuthService` provides methods to manage tokens for authentication and handling password reset. The `AuthService` implementation is backed by Firebase.

* TOC
{:toc}

## Setting up

1. Create a new Firebase project using the [console](https://console.firebase.google.com/) if you do not have one
2. Generate a Firebase service account private key (note: you must be an "Owner" of your project)
   - Go to your project in the Firebase console
   - "Project settings" > "Service accounts" > "Generate private key"
   - A file will be downloaded, copy it into `/backend/typescript/` or `/backend/python/` and rename it **`firebaseServiceAccount.json`**
2. Add these lines to the root `.env` file in the repo
```
GOOGLE_APPLICATION_CREDENTIALS=firebaseServiceAccount.json
# Retrieve the API key from the Firebase console
FIREBASE_WEB_API_KEY=<your-web-api-key>
FIREBASE_REQUEST_URI=http://localhost
```

## Basic Auth Flow

In contrast with many other UW Blueprint projects that use both the Firebase Client library and Admin SDK to handle authentication, we use the Firebase Admin SDK server-side only. This is done to decouple the frontend and backend and ensure that new `AuthService` implementations can easily be substituted. The login, refresh, and API request flows when using auth is illustrated below. While we use REST endpoints in these diagrams, note that the GraphQL flows are identical.

| ![Auth Login Flow]({{ "assets/images/auth-login.png" | relative_url }}) |
|:--:| 
| *Login Flow*|

| ![Auth Refresh Flow]({{ "assets/images/auth-refresh.png" | relative_url }}) |
|:--:| 
| *Refresh Flow*|

| ![Auth API Request Flow]({{ "assets/images/auth-request.png" | relative_url }}) |
|:--:| 
| *API Request Flow*|

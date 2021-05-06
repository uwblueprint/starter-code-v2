---
layout: default
title: User Auth
nav_order: 3
has_children: true
---

# User Auth

Starter Code comes with `UserService` and `AuthService` pre-built for your use if you opted into user auth through the CLI. `UserService` provides basic CRUD methods for you app's users, and `AuthService` provides methods to manage tokens for authentication and handling password reset. The `AuthService` implementation is backed by Firebase.

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
```

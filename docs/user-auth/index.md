---
layout: default
title: User Auth
nav_order: 3
permalink: /docs/user-auth
has_children: true
---

# User Auth

Starter Code comes with `UserService` & `AuthService` pre-built for your use. `UserService` provides basic CRUD methods for you app's users, and `AuthService` provides methods to manage tokens for authentication and handling password reset. We use Firebase for authentication.

## Setting up

1. Generate a Firebase service account private key
   - Go to your project in the Firebase console
   - "Project settings" > "Service accounts" > "Generate private key"
   - A file will be downloaded, copy it into `/backend/typescript/` and rename it `firebaseServiceAccount.json`
2. Pull from secret manager OR add these lines to the root .env file in the repo

```
GOOGLE_APPLICATION_CREDENTIALS=firebaseServiceAccount.json

# Retrieve the value from the Firebase console
FIREBASE_WEB_API_KEY=*************************
```

3. Run the application `docker-compose up --build`

---
layout: default
title: Getting Started
nav_order: 2
permalink: /docs/getting-started
---

# Getting Started
{:.no_toc}

* TOC
{:toc}

## Prerequisites

* Ensure you have Docker installed and that Docker Desktop is running.
  Installation instructions: [MacOS](https://docs.docker.com/docker-for-mac/install/) | [Windows (Home)](https://docs.docker.com/docker-for-windows/install-windows-home/) | [Windows (Pro, Enterprise, Education)](https://docs.docker.com/docker-for-windows/install/) | [Linux](https://docs.docker.com/engine/install/#server)
```bash
# verify your installation by running the following in a terminal
$ docker info
$ docker-compose --version
```

* Ensure you have Node.js installed. Please use the **current LTS version**, so please upgrade if necessary; at the time of writing, current LTS version is v16.13.1. Ensure you have `npx` as well, which should have been included with the Node.js installation.

    Side note: [Volta](https://volta.sh) is a great tool for managing Node versions!
```bash
# verify that you have npx
$ npx -v
```
* Ensure that you have Git installed (any version >= 1.7.10)
```bash
# verify that you have git
$ git --version
```

## Setting up Starter Code

**Important:** Please complete all instructions applicable to your stack choice unless a step is clearly indicated as optional.
{: .banner-info .mb-6 }

1. Run the [`@uwblueprint/create-bp-app`](https://www.npmjs.com/package/@uwblueprint/create-bp-app) CLI. We recommend using Terminal in MacOS and Linux, and Command Prompt in Windows.
```bash
$ npx @uwblueprint/create-bp-app@latest
```
2. Answer the prompts in the CLI to specify your stack preferences
![create-bp-app]({{ "assets/images/create-bp-app.gif" | relative_url }})

3. `cd` into the generated starter-code-v2 directory

4. Create a new `.env` file at the **root** of starter-code-v2
    * **If using PostgreSQL:** Add the following variables to the `.env` file (you can switch to more suitable names for your project later):
    ```bash
    # local database env variables
    POSTGRES_DB_DEV=scv2
    POSTGRES_DB_TEST=scv2_test
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    DB_HOST=scv2_db
    ```
    * **If using MongoDB:** Create a MongoDB cluster in [Atlas](https://www.mongodb.com/cloud/atlas). For more specific instructions on how to do this, consult #3 in the setup instructions [here](https://github.com/uwblueprint/bootcamp-mern-rest#setup).
    
        Generate a connection string (it should start with `mongodb+srv://...`) and add it as a value in the `.env` file:
    ```bash
    # MongoDB connection string
    MG_DATABASE_URL=<your-connection-string>
    ```
    * **If using built-in user auth:** Create a new Firebase project using the [console](https://console.firebase.google.com/).
    
        Generate a service account private key: "Project settings" -> "Service accounts" -> "Generate private key" (note: you must be a project "Owner" to do this). A file will be downloaded, remember where it's saved.
        
        Please also make note of the web API key in "Project Settings" (you will need to enable Firebase authentication to see this value, select "Email/Password" as the sign-in method if prompted).
        
        Next, add these values to the `.env` file:
    ```bash
    # Firebase secrets
    FIREBASE_WEB_API_KEY=<your-web-api-key>
    FIREBASE_REQUEST_URI=http://localhost
    # These values are found in the downloaded service account file
    FIREBASE_PROJECT_ID=<project_id>
    FIREBASE_SVC_ACCOUNT_PRIVATE_KEY_ID=<private_key_id>
    FIREBASE_SVC_ACCOUNT_PRIVATE_KEY=<private_key>
    FIREBASE_SVC_ACCOUNT_CLIENT_EMAIL=<client_email>
    FIREBASE_SVC_ACCOUNT_CLIENT_ID=<client_id>
    FIREBASE_SVC_ACCOUNT_AUTH_URI=<auth_uri>
    FIREBASE_SVC_ACCOUNT_TOKEN_URI=<token_uri>
    FIREBASE_SVC_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL=<auth_provider_x509_cert_url>
    FIREBASE_SVC_ACCOUNT_CLIENT_X509_CERT_URL=<client_x509_cert_url>
    ```
    * **If using file storage:** If you have not already done so, create a Firebase project using the [console](https://console.firebase.google.com/). Create a default Firebase Cloud Storage bucket (navigate to "Storage" in the Firebase console).
    
        Next, add the bucket name to the `.env` file. It looks like `<PROJECT_ID>.appspot.com` and can be found in the Firebase Cloud Storage web interface (omit the `gs://` prefix):
    ```bash
    FIREBASE_STORAGE_DEFAULT_BUCKET=<PROJECT_ID>.appspot.com
    ```
    * **If using Python backend:** Add these values to the `.env`:
    ```bash
    # Flask configs
    FLASK_CONFIG=development
    FLASK_APP=app
    ```

5. Create a `.env` file in the **frontend** subdirectory and add this value:
```bash
REACT_APP_BACKEND_URL=http://localhost:5000
```

6. **If using built-in user auth:** follow instructions [here](google-signin/setup.md) to configure Google OAuth. *It is fine to skip this step for now if you don't immediately need this feature, but note that you will see a greyed out Google login button on the sign-in page and an error may be alerted.*

7. Follow instructions [here](email-service/setup.md) to set up credentials for EmailService.

8. Run the application:
```bash
$ docker-compose up --build
```

9. **If using PostgreSQL:** run the initial migrations:
```bash
# TypeScript backend
$ docker exec -it <typescript-backend-container-name> /bin/bash -c "node migrate up"
# Python backend
$ docker exec -it <python-backend-container-name> /bin/bash -c "flask db upgrade"
```

10. **If using built-in user auth:** Create a test admin user. Navigate to [http://localhost:3000/login](http://localhost:3000/login) in a browser and click "Sign Up".

    Fill out the form fields, making sure to use a real email account that you can access (uwblueprint.org email recommended). Click "Sign Up" and then check your email inbox for a verification link. Click the link once you've received it.

    By default, users created through the frontend have a "User" role. To elevate to "Admin", manually update the user record in the database. You can edit directly in Atlas if using MongoDB. If using PostgreSQL, run the following through the psql shell in the database container:
    ```sql
    -- Query users table for your user's id
    SELECT * FROM users;
    -- Update your user's role
    UPDATE users SET role = 'Admin' WHERE  id = <your-id>;
    ```

11. Verify your setup by running E2E tests.

    Create a `.env` file in the **e2e-tests** subdirectory and add the following values:
    ```bash
    # E2E test script configs
    TEST_SCRIPT_EMAIL=<test-admin-user-email>
    TEST_SCRIPT_PASSWORD=<test-admin-user-password>
    TEST_SCRIPT_BACKEND_URL=http://localhost:5000
    TEST_SCRIPT_NEW_USER_EMAIL=<another-email-address-you-have-access-to>
    ```

    Ensure that you have Python 3 installed on your computer, then install the following packages:
    ```bash
    $ pip3 install pytest python-dotenv inflection --user
    ```

    Run tests:
    ```bash
    $ cd e2e-tests
    # Run pytest using the following options
    # --lang python (if using Python)
    # --api graphql (if using GraphQL)
    # --auth (if using auth)
    # --fs (if using file storage)
    # For example, if using TypeScript, GraphQL, auth, and file storage:
    $ python3 -m pytest --api graphql --auth --fs
    ```

    You have succeeded setting up Starter Code if all tests pass. Congrats! 🎉

12. After stopping the application, run `git init` to initialize your repository

## Secret Management

To set up secret management tools, please follow this [guide](https://www.notion.so/uwblueprintexecs/Secret-Management-2d5b59ef0987415e93ec951ce05bf03e).

## Common Docker Commands

If you're new to Docker, you can learn more about `docker-compose` commands [here](https://docs.docker.com/compose/reference/).

- `docker-compose build` Builds images
- `docker-compose up` Builds images (if they don't exist) & starts containers
- `docker-compose up --build` Builds images & starts containers
- `docker-compose down` Stops the containers

## Other Useful Commands

### Get Names and Statuses of Running Containers
```bash
$ docker ps
```

### Accessing PostgreSQL Database

```bash
# run a bash shell in the container
$ docker exec -it <container-name> /bin/bash

# in container now
$ psql -U postgres -d <DB_NAME>

# alternatively, you can combine the last two commands:
$ docker exec -it <container-name> /bin/bash -c "psql -U postgres -d <DB_NAME>"

# in postgres shell, some common commands:
# display all table names
\dt
# quit
\q
# you can run any SQL query, don't forget the semicolon!
SELECT * FROM <table-name>;
```

### Linting and Formatting
Python backend:
```bash
$ docker exec -it <container-name> /bin/bash -c "black ."
```

TypeScript backend and frontend:
```bash
# linting & formatting warnings only
$ docker exec -it <container-name> /bin/bash -c "yarn lint"

# linting with fix & formatting
$ docker exec -it <container-name> /bin/bash -c "yarn fix"
```

### Running Tests
Python backend:
```bash
$ docker exec -it <container-name> /bin/bash -c "pip install -e . && pytest"
```

TypeScript backend and frontend:
```bash
$ docker exec -it <container-name> /bin/bash -c "yarn test"
```

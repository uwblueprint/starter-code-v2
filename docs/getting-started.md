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

* Ensure you have Node.js installed. Please use the **current LTS version**, so please upgrade if necessary; at the time of writing, current LTS is v14.17.6. Ensure you have `npx` as well, which should have been included with the Node.js installation. Side note: [Volta](https://volta.sh) is a great tool for managing Node versions!
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

1. Run the [`@uwblueprint/create-bp-app`](https://www.npmjs.com/package/@uwblueprint/create-bp-app) CLI
```bash
$ npx @uwblueprint/create-bp-app@latest
```
2. Answer the prompts in the CLI to specify your stack preferences

3. `cd` into the generated starter-code-v2 directory

4. Create a new `.env` file at the **root** of starter-code-v2
    * **If using PostgreSQL:** add the following variables to the `.env` (you can switch to more suitable values for your project later):
    ```
    POSTGRES_DB=starter-code-v2
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    DB_HOST=starter-code-v2_db_1
    DB_TEST_HOST=starter-code-v2_db-test_1
    ```
    * **If using MongoDB:** Create a MongoDB cluster in [Atlas](https://www.mongodb.com/cloud/atlas) (for more specific instructions on how to do this, consult #3 in the setup instructions [here](https://github.com/uwblueprint/bootcamp-mern-rest#setup)). Generate a connection string (it should start with `mongodb+srv://...`) and add it as a value in the `.env` file
    ```
    MG_DATABASE_URL=<your-connection-string>
    ```
    * **If using built-in user auth:** Create a new Firebase project using the [console](https://console.firebase.google.com/). Generate a service account private key: "Project settings" > "Service accounts" > "Generate private key" (note: you must be a project "Owner" to do this). A file will be downloaded, please rename it to **`firebaseServiceAccount.json`** and place it starter-code-v2's backend directory (either `backend/typescript` or `backend/python`). Also make note of the web API key in "Project Settings" (you will need to enable Firebase authentication to see this value, select "Email/Password" as the sign-in method if prompted). Next, add these values to the `.env` file:
    ```
    GOOGLE_APPLICATION_CREDENTIALS=firebaseServiceAccount.json
    FIREBASE_WEB_API_KEY=<your-web-api-key>
    FIREBASE_REQUEST_URI=http://localhost
    ```
    * **If using file storage:** Create a default Firebase Cloud Storage bucket (navigate to "Storage" in the Firebase console). Next, add the bucket name to the `.env` file. It looks like `<PROJECT_ID>.appspot.com` and can be found in the Firebase Cloud Storage web interface (omit the `gs://` prefix):
    ```
    DEFAULT_BUCKET=<PROJECT_ID>.appspot.com
    ```
    * **If using Python backend:** Add these values to the `.env`:
    ```
    FLASK_CONFIG=development
    FLASK_APP=app
    ```

5. Create a `.env` file in the **frontend** subdirectory and add this value:
```
REACT_APP_BACKEND_URL=http://localhost:5000
```

6. **If using built-in user auth:** follow instructions [here](google-signin/setup.md) to configure Google OAuth. It is fine to skip this step for now if you don't immediately need this feature, but note that you will see a greyed out Google login button on the sign-in page and an error may be alerted.

    <div>
    <strong>For Bootcamp Only:</strong> If you're not using the built-in auth service, or if you are using auth but don't foresee the need to use the reset password functionality, please feel free to skip <strong>step 7</strong> below to save some time. However, you will need to make the following changes if user auth was enabled:
    <ul>
    <li><strong>If using Python backend:</strong> remove the <code>email_service</code> argument passed into the <code>AuthService</code> constructor call in <code>backend/python/app/rest/auth_routes.py</code> (near line 26). The resulting line should just be <code>auth_service = AuthService(current_app.logger, user_service)</code>.
    </li>
    <li><strong>If using TypeScript backend with REST:</strong> remove the <code>emailService</code> argument passed into the <code>AuthService</code> constructor call in <code>backend/typescript/rest/authRoutes.ts</code> (near line 13). The resulting line should just be <code>const authService: IAuthService = new AuthService(new UserService());</code>.
    </li>
    <li><strong>If using TypeScript backend with GraphQL:</strong> remove the <code>emailService</code> argument passed into the <code>AuthService</code> constructor call in <code>backend/typescript/graphql/resolvers/authResolvers.ts</code> (near line 11). The resulting line should just be <code>const authService: IAuthService = new AuthService(new UserService());</code>.
    </li>
    </ul>

    <p>You should also remove all other variables and imports made unnecessary as a result.</p>
    </div>
    {: .banner-info .mb-6 }
7. Follow instructions [here](email-service/setup.md) to setup credentials for EmailService.

8. Run the application:
```
docker-compose up --build
```

9. **If using Python backend with PostgreSQL:** run the initial migrations
```bash
$ docker exec -it <python-backend-container-name> /bin/bash -c "flask db upgrade"
```

10. **If using built-in user auth:** Create a seed admin user
   * Go into your Firebase project > Authentication, choose "Email/Password" as sign-in method if prompted (you can change this for your project later). Create a user and note the uid.
   * **If using PostgreSQL:**
   ```bash
   # get the database container name
   $ docker ps
   # run a bash shell in the database container
   docker exec -it <insert-container-name> /bin/bash
   # run a psql shell
   $ psql -U postgres -d starter-code-v2
   # if using TypeScript backend
   $ INSERT INTO users (first_name, last_name, auth_id, role, "createdAt", "updatedAt") VALUES ('First', 'Last', 'insert-firebase-uid', 'Admin', '2021-04-30', '2021-04-30');
   # if using Python backend
   $ INSERT INTO users (first_name, last_name, auth_id, role) VALUES ('First', 'Last', 'insert-firebase-uid', 'Admin');
   ```
   * **If using MongoDB:** Use the Atlas UI to create a user (please use camelCase for document keys if using TypeScript, and snake_case if using Python):
   ```jsonc
   // if using TypeScript backend
   {
       "firstName": "First",
       "lastName": "Last",
       "authId": "firebase-auth-id-from-above",
       "role": "Admin"
   }
   // if using Python backend:
   {
       "first_name": "First",
       "last_name": "Last",
       "auth_id": "firebase-auth-id-from-above",
       "role": "Admin"
   }
   ```
11. After stopping the application, run `git init` to initialize your repository

## Secret Management

To set up secret management tools, please see this [guide](https://www.notion.so/uwblueprintexecs/Secret-Management-2d5b59ef0987415e93ec951ce05bf03e).

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

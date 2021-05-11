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

* Ensure you have Node.js installed. Please use the **current LTS version**, so please upgrade if necessary; at the time of writing, current LTS is v14.16.1. Ensure you have `npx` as well, which should have been included with the Node.js installation
```bash
# verify that you have npx
$ npx -v
```
* Ensure that you have Git installed (any version)
```bash
# verify that you have git
git --version
```

## Setting up Starter Code

1. Run the [`@uwblueprint/create-bp-app`](https://www.npmjs.com/package/@uwblueprint/create-bp-app) CLI
```bash
# if you prefer npx:
$ npx @uwblueprint/create-bp-app@latest
# if you prefer yarn
$ yarn create @uwblueprint/bp-app@latest
```
2. Answer the prompts in the CLI to specify your stack preferences

3. `cd` into the generated starter-code-v2 directory

4. Create a new `.env` file at the **root** of starter-code-v2
    * Add the this value to the `.env`:
    ```
    REACT_APP_BACKEND_URL=http://localhost:5000
    ```
    * **If using PostgreSQL:** add the following variables to the `.env` (you can switch to more suitable values for your project later):
    ```
    POSTGRES_DB=starter-code-v2
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    DB_HOST=starter-code-v2_db_1
    ```
    * **If using MongoDB:** Create a MongoDB cluster in [Atlas](https://www.mongodb.com/cloud/atlas) (for more specific instructions on how to do this, consult #3 in the setup instructions [here](https://github.com/uwblueprint/bootcamp-mern-rest#setup)). Generate a connection string (it should start with `mongodb+srv://...`) and add it as a value in the `.env` file
    ```
    MG_DATABASE_URL=<your-connection-string>
    ```
    * **If using built-in user auth:** Create a new Firebase project using the [console](https://console.firebase.google.com/). Generate a service account private key: "Project settings" > "Service accounts" > "Generate private key" (note: you must be a project "Owner" to do this). A file will be downloaded, please rename it to **`firebaseServiceAccount.json`** and place it starter-code-v2's backend directory (either `backend/typescript` or `backend/python`). Also make note of the web API key in "Project Settings". Next, add these values to the `.env` file:
    ```
    GOOGLE_APPLICATION_CREDENTIALS=firebaseServiceAccount.json
    FIREBASE_WEB_API_KEY=<your-web-api-key>
    ```
    * **If using Python backend:** Add this value to the `.env`:
    ```
    FLASK_CONFIG=development
    ```
5. Follow instructions [here](email-service/setup.md) to setup credentials for EmailService.

5. Run the application:
```
docker-compose up --build
```

7. **If using built-in user auth:** Create a seed admin user
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
   $ INSERT INTO users (first_name, last_name, auth_id, role, "createdAt", "updatedAt") VALUES ('First', 'Last', 'insert-firebase-ui', 'Admin', '2021-04-30', '2021-04-30');
   # if using Python backend
   $ INSERT INTO users (first_name, last_name, auth_id, role) VALUES ('First', 'Last', 'insert-firebase-ui', 'Admin');
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
8. After stopping the application, run `git init` to initialize your repository

## Common Docker Commands

If you're new to Docker, you can learn more about `docker-compose` commands [here](https://docs.docker.com/compose/reference/).

- `docker-compose build` Builds images
- `docker-compose up` Builds images (if they don't exist) & starts containers
- `docker-compose up --build` Builds images & starts containers
- `docker-compose down` Stops the containers

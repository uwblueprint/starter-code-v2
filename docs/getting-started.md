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

### Prerequisites

* Ensure you have Docker installed and that Docker Desktop is running.
  Installation instructions: [MacOS](https://docs.docker.com/docker-for-mac/install/) | [Windows (Home)](https://docs.docker.com/docker-for-windows/install-windows-home/) | [Windows (Pro, Enterprise, Education)](https://docs.docker.com/docker-for-windows/install/) | [Linux](https://docs.docker.com/engine/install/#server)
```bash
# verify your installation by running the following in a terminal
$ docker --version
$ docker-compose --version
```

* Ensure you have Node.js installed (current LTS version preferred), with `npx` (should be included with Node.js installation), or `yarn`
```bash
# (if using npx) verify your installation
$ npx -v
# (if using yarn) verify your installation
$ yarn -v
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

3. Create a new `.env` file at the **root** of starter-code-v2
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
4. Follow instructions [here](email-service/setup.md) to setup credentials for EmailService.

5. Run the application:
```
docker-compose up --build
```

## Common Docker Commands

If you're new to Docker, you can learn more about `docker-compose` commands [here](https://docs.docker.com/compose/reference/).

- `docker-compose build` Builds images
- `docker-compose up` Builds images (if they don't exist) & starts containers
- `docker-compose up --build` Builds images & starts containers
- `docker-compose down` Stops the containers

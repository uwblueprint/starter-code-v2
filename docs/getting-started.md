---
layout: default
title: Getting Started
nav_order: 2
permalink: /docs/getting-started
---

# Getting Started

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


## Running an app locally

Clone your team's project repo, and navigate to the project's root directory.

Run `docker-compose up --build` to run the application. If you're new to docker, you can learn more about `docker-compose` commands [here](https://docs.docker.com/compose/reference/).

- `docker-compose build` Builds images
- `docker-compose up` Builds images (if they don't exist) & starts containers
- `docker-compose up --build` Builds images & starts containers
- `docker-compose down` Stops the containers

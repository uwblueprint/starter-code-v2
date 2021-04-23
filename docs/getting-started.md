---
layout: default
title: Getting Started
nav_order: 2
permalink: /docs/getting-started
---

# Getting Started

### Prerequisites

- Make sure you have [Docker installed](https://docs.docker.com/get-docker/), and that Docker Desktop is running.
- If you haven't already, set up vault client by following [these instructions](https://www.notion.so/uwblueprintexecs/Secret-Management-2d5b59ef0987415e93ec951ce05bf03e).

## Setting up Starter-Code-V2

Skip this if your PL has already set up your project.

_Add CLI setup instructions stuff later_
_Setting up vault, firebase for team etc_

## Running an app locally

Clone your team's project repo, and navigate to the project's root directory.

Run `docker-compose up --build` to run the application. If you're new to docker, you can learn more about `docker-compose` commands [here](https://docs.docker.com/compose/reference/).

- `docker-compose build` Builds images
- `docker-compose up` Builds images (if they don't exist) & starts containers
- `docker-compose up --build` Builds images & starts containers
- `docker-compose down` Stops the containers

---
layout: home
title: Home
nav_order: 1
permalink: /
---

# Welcome to the Starter Code V2 Docs
{:.no_toc}

* TOC
{:toc}

## What is Starter Code?

Starter Code is an easy to set up, flexible, and customizable bootstrap for [UW Blueprint](https://uwblueprint.org) projects. It aims to encourage best development practices (e.g. programming to interfaces, modularity, and layered architecture), and provide baseline implementations of features that nearly all our projects share. Starter Code supports 12 different stack combinations, allowing "mix and match" between the technologies most commonly used by UW Blueprint.

Starter Code does **not** impose a prescriptive way of building your applications. The implementations of built-in features are completely transparent so developers can and should modify and extend upon these features.

## What is Starter Code (but with more words)?

Starter Code is generated using the CLI tool [`@uwblueprint/create-bp-app`](https://www.npmjs.com/package/@uwblueprint/create-bp-app), which gathers your stack preferences. The supported choices are:

**Backend Language:** TypeScript (Express.js on Node.js) or Python (with Flask)<br>
**Backend API:** REST or GraphQL<br>
**Database:** PostgreSQL or MongoDB<br>
**User Auth:** Opt-in or opt-out

**Note:** We do not currently support stack combinations involving both Python and GraphQL.

The frontend is fixed as a React TypeScript application, which is typical for UW Blueprint projects.

The 4 services offered by Starter Code:
* **EntityService:** provides CRUD service on a generic placeholder model called `Entity`
* **UserService:** provides CRUD service on a `User` model (provided only if opted into user auth)
* **AuthService:** provides user authentication and authorization services (provided only if opted into user auth)
* **EmailService:** provides email-sending service

Starter Code also offers several other built-in features:
* Linters & Formatters
* Loggers
* Out of the box support for containerization via Docker
* Local PostgreSQL database setup via Docker
* Internal secret management tools

Another notable feature of Starter Code is its demonstration of the principle of programming to interfaces. This means application components only depend on **functionality** provided by other components, not their underlying implementations. To illustrate this concept, consider a REST endpoint that is used to create a `User`. The REST layer should not know or care if the `User` is persisted using PostgreSQL or MongoDB, all it needs to know is that the persistence layer provides a `createUser` method. Similarly, the persistence layer should not know or care whether a REST controller or a GraphQL controller is calling into its methods.

At the moment, each service offered by Starter Code is backed by at most 2 different implementations. However, if you would like to add or substitute another implementation, you can easily do so by implementing the provided interfaces. The rest of the application should not require any refactoring and will continue functioning, oblivious to any change that has taken place. For this reason, Starter Code is **flexible**.

| ![Starter Code Architecture Diagram]({{ "/assets/images/starter-code-architecture.png" | prepend: site.url }}) |
|:--:| 
| *Starter Code Architecture Diagram*|

## Why should I use Starter Code?

Although UW Blueprint projects tend to share similar structures and many key features (e.g. basic CRUD functionalities on some models, user authentication, and automated email capability), the autonomous nature of project teams makes it difficult to share knowledge, experience, and code, so these features are built time and time again. Starter Code is our attempt to solve these problems, while also trying to encourage best development practices. Put simply, Starter Code aims to help project teams output higher quality and maintainable code, **so we can deliver the most value to our NPO partners**.

Teams should adopt Starter Code and use it as a foundation to get their projects off the ground faster, and as a guideline for how to structure their applications.


---
layout: default
title: TypeScript Migrations (Sequelize)
nav_order: 2
parent: Database Migrations
---

# TypeScript Migrations (Sequelize)
{:.no_toc}

The [Umzug](https://github.com/sequelize/umzug) migration tool is used to run migrations. Umzug is built by the creators of Sequelize and it contains the core migration logic used by the Sequelize CLI. Starter Code uses Umzug directly as the Sequelize CLI does not yet support migration files written in TypeScript.

* TOC
{:toc}

## How to create and run a migration?

1. Run both the TypeScript backend and database containers, you can use:
```bash
$ docker-compose up
```

2. Run a bash shell in the TypeScript backend container
```bash
# get container name
$ docker ps
# run a bash shell
$ docker exec -it <container-name> /bin/bash
```

3. If there are example migrations in the `migrations` directory (included with Starter Code), delete them.

4. Create a migration file
```bash
# in the TypeScript backend container
$ node migrate create --name <descriptive-migration-name>
# if this is your first migration, you may need to specify the folder
$ node migrate create --name <descriptive-migration-name> --folder migrations
```

5. Replace the contents of the generated migration file with the [Base Migration Template](#base-migration-template) below.

6. Add your migration logic. You need to **define both an `up` function that specifies the schema changes you want to make, as well as a `down` function** which specifies the inverse operations to the changes in `up`. You can take a look at the example migrations [below](#templates) and Sequelize's [QueryInterface Docs](https://sequelize.org/master/manual/query-interface.html) for help. The `QueryInterface` exposes methods that can be used to modify the database (e.g. `createTable`, `addColumn`, `removeColumn`, etc). More complicated migration logic could involve using several `QueryInterface` methods. Note that we are using the `sequelize-typescript` wrapper library so there can be slight syntax differences with the docs. For example, we access data types through `DataType` instead of `DataTypes`.

7. Run the migration:
```bash
# still in the TypeScript backend container
$ node migrate up
```

## Helpful Commands
```bash
# show CLI help
$ node migrate --help

# apply migrations
$ node migrate up

# revert the last migration
$ node migrate down

# revert all migrations
$ node migrate down --to 0

# run only two migrations
$ node migrate up --step 2 

# create a new migration file
$ node migrate create --name my-migration.ts
```

## Templates

### Base Migration Template
```ts
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {};

export const down: Migration = async ({ context: sequelize }) => {};
```

### Creating Table Template
```ts
import { DataType } from "sequelize-typescript";

import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("test", {
    id: {
      type: DataType.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("test");
};
```

### Adding Column Template
```ts
import { DataType } from "sequelize-typescript";

import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().addColumn("test", "new", {
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().removeColumn("test", "new");
};
```

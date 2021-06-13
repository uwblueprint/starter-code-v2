---
layout: default
title: Python Migrations (SQLAlchemy)
nav_order: 1
parent: Database Migrations
---

# Python Migrations (SQLAlchemy)
{:.no_toc}

The [Flask-Migrate](https://flask-migrate.readthedocs.io/en/latest) tool is used to run migrations, it is a popular extension used by Flask + SQLAlchemy applications.

* TOC
{:toc}

## How to create and run a migration?

1. Make changes to your models in the `app/models` folder. Flask-Migrate can detect these changes and auto-generate migration files
2. If you created a new model, ensure that you add the new import to `init_app` in `app/models/__init__.py`. Although the import is not used by the code in the file, it is required by the migration tool
3. Run both the Python backend and database containers, you can use:
```bash
$ docker-compose up
```
4. Run a bash shell in the Python backend container
```bash
# get container name
$ docker ps
# run a bash shell
$ docker exec -it <container-name> /bin/bash
```
5. In the Python backend container, generate a migration file
```bash
$ flask db migrate -m "Short message describing the migration"
```
6. Run the migration
```
# still in the Python backend container
$ flask db upgrade
```

## Helpful Commands
```
Usage: flask db [OPTIONS] COMMAND [ARGS]...

  Perform database migrations.

Options:
  --help  Show this message and exit.

Commands:
  branches   Show current branch points
  current    Display the current revision for each database.
  downgrade  Revert to a previous version
  edit       Edit a revision file
  heads      Show current available heads in the script directory
  history    List changeset scripts in chronological order.
  init       Creates a new migration repository.
  merge      Merge two revisions together, creating a new revision file
  migrate    Autogenerate a new revision file (Alias for 'revision...
  revision   Create a new revision file.
  show       Show the revision denoted by the given symbol.
  stamp      'stamp' the revision table with the given revision; don't run...
  upgrade    Upgrade to a later version
```

For more details, see the official [docs](https://flask-migrate.readthedocs.io/en/latest/#command-reference).

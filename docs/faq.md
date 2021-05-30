---
layout: default
title: FAQ
nav_order: 7
permalink: /docs/faq
---

# Frequently Asked Questions (FAQ):

### Where can I report issues and submit feedback?
You can open an issue in the [starter-code-v2](https://github.com/uwblueprint/starter-code-v2/issues/new/choose) repo in GitHub, or message the #internal-tools-help channel in UW Blueprint's Slack workspace.

### How do I resolve "cannot find module <name\> or its corresponding type declarations" in my TypeScript app? <name\> is already listed in package.json.
Try:
```bash
$ docker-compose down
```
Then:
```bash
$ docker-compose up --build
```

### Can I ignore this warning when starting up my TypeScript backend? "DeprecationWarning: Listening to events on the Db class has been deprecated and will be removed in the next major version."
Yes, you can safely ignore it. It can be resolved by upgrading the MongoDB driver and the mongoose package.

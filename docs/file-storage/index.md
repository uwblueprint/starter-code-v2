---
layout: default
title: File Storage
nav_order: 6
has_children: true
---

# File Storage

`FileStorageService` provides CRUD methods on files. By default, Starter Code uses Firebase Cloud Storage to store files. For ease of access, here are the current Firebase Cloud Storage free tier quotas (September, 2021), more information [here](https://firebase.google.com/pricing):

| Type | Quota |
| :------ | :------ |
| GB Stored | 5 GB |
| GB downloaded | 1 GB/day |
| Upload operations | 20K/day |
| Download operations | 50K/day |
| Multiple buckets per project | No |

The following file types are supported out of the box:
* text/plain
* application/pdf
* image/png
* image/jpeg
* image/gif

Starter Code explicitly limits the types of files allowed for security purposes, **however you can easily enable other file types**.

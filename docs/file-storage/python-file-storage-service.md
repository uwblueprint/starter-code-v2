---
layout: default
title: Python FileStorageService Docs
nav_order: 2
parent: File Storage
---

# Python FileStorageService Documentation

### Methods
* [get\_file](#interfaces.file_storage_service.IFileStorageService.get_file)
* [create\_file](#interfaces.file_storage_service.IFileStorageService.create_file)
* [update\_file](#interfaces.file_storage_service.IFileStorageService.update_file)
* [delete\_file](#interfaces.file_storage_service.IFileStorageService.delete_file)

<a id="interfaces.file_storage_service.IFileStorageService.get_file"></a>
#### get\_file

```python
get_file(file_name, expiration_time=timedelta(minutes=60))
```

Returns a signed url to the file with the given file name if found

**Arguments**:

- `file_name`: name of the file
- :type file_name: str
- `expiration_time`: the lifetime of the url, defaults to timedelta(minutes=60)
- :type expiration_time: timedelta, optional

**Returns**:

Signed url of the file (:rtype str or None if file is not found)

<a id="interfaces.file_storage_service.IFileStorageService.create_file"></a>
#### create\_file

```python
create_file(file_name, file, content_type=None)
```

Creates a file in the default bucket with given file name

**Arguments**:

- `file_name`: name of the file
- :type file_name: str
- `file`: file to upload
- :type file: file
- `content_type`: MIME type of the file, defaults to None
- :type content_type: str, optional

**Raises**:

- `Exception`: file name already exists

<a id="interfaces.file_storage_service.IFileStorageService.update_file"></a>
#### update\_file

```python
update_file(file_name, file, content_type=None)
```

Replaces the file that has given file name in default bucket

**Arguments**:

- `file_name`: name of the file
- :type file_name: str
- `file`: file to replace with
- :type file: file
- `content_type`: MIME type of the file, defaults to None
- :type content_type: str, optional

**Raises**:

- `Exception`: file name does not already exist

<a id="interfaces.file_storage_service.IFileStorageService.delete_file"></a>
#### delete\_file

```python
delete_file(file_name)
```

Deletes the file with the given file name

**Arguments**:

- `file_name`: name of the file
- :type file_name: str

**Raises**:

- `Exception`: file not found

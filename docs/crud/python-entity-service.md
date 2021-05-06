---
layout: default
title: Python EntityService Docs
nav_order: 1
parent: CRUD
---

# Python EntityService Documentation

### Methods
* [get\_entities](#interfaces.entity_service.IEntityService.get_entities)
* [get\_entity](#interfaces.entity_service.IEntityService.get_entity)
* [create\_entity](#interfaces.entity_service.IEntityService.create_entity)
* [update\_entity](#interfaces.entity_service.IEntityService.update_entity)
* [delete\_entity](#interfaces.entity_service.IEntityService.delete_entity)

<a name="interfaces.entity_service.IEntityService.get_entities"></a>
#### get\_entities

```python
get_entities()
```

Return a list of all entities

**Returns**:

A list of dictionaries from Entity objects (:rtype: list of dictionaries)

<a name="interfaces.entity_service.IEntityService.get_entity"></a>
#### get\_entity

```python
get_entity(id)
```

Return a dictionary from the Entity object based on id

**Arguments**:

- `id`: Entity id

**Returns**:

dictionary of Entity object (:rtype: dictionary)

**Raises**:

- `Exception`: id retrieval fails

<a name="interfaces.entity_service.IEntityService.create_entity"></a>
#### create\_entity

```python
create_entity(entity)
```

Create a new Entity object

**Arguments**:

- `entity`: dictionary of entity fields

**Returns**:

dictionary of Entity object (:rtype: dictionary)

**Raises**:

- `Exception`: if entity fields are invalid

<a name="interfaces.entity_service.IEntityService.update_entity"></a>
#### update\_entity

```python
update_entity(id, entity)
```

Update existing entity

**Arguments**:

- `entity`: dictionary of entity fields
- `id`: Entity id

**Returns**:

dictionary of Entity object (:rtype: dictionary)

<a name="interfaces.entity_service.IEntityService.delete_entity"></a>
#### delete\_entity

```python
delete_entity(id)
```

Delete existing entity

**Arguments**:

- `id`: Entity id

**Returns**:

id of the Entity deleted (:rtype: integer)


---
layout: default
title: TypeScript EntityService Docs
nav_order: 3
parent: CRUD
---

# TypeScript EntityService Documentation

### Methods

- [createEntity](typescript-entity-service.md#createentity)
- [deleteEntity](typescript-entity-service.md#deleteentity)
- [getEntities](typescript-entity-service.md#getentities)
- [getEntity](typescript-entity-service.md#getentity)
- [updateEntity](typescript-entity-service.md#updateentity)


### createEntity

▸ **createEntity**(`entity`: EntityRequestDTO): *Promise*<EntityResponseDTO\>

create an Entity with the fields given in the DTO, return created Entity

**`throws`** Error if creation fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entity` | EntityRequestDTO | user's email |

**Returns:** *Promise*<EntityResponseDTO\>

the created Entity

Defined in: IEntityService.ts:41

___

### deleteEntity

▸ **deleteEntity**(`id`: *string*): *Promise*<void\>

delete the entity with the given id

**`throws`** Error if deletion fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | *string* | entity id |

**Returns:** *Promise*<void\>

Defined in: IEntityService.ts:60

___

### getEntities

▸ **getEntities**(): *Promise*<EntityResponseDTO[]\>

retrieve all Entities

**`throws`** Error if retrieval fails

**Returns:** *Promise*<EntityResponseDTO[]\>

returns array of Entities

Defined in: IEntityService.ts:33

___

### getEntity

▸ **getEntity**(`id`: *string*): *Promise*<EntityResponseDTO\>

retrieve the Entity with the given id

**`throws`** Error if retrieval fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | *string* | entity id |

**Returns:** *Promise*<EntityResponseDTO\>

requested Entity

Defined in: IEntityService.ts:25

___

### updateEntity

▸ **updateEntity**(`id`: *string*, `entity`: EntityRequestDTO): *Promise*<``null`` \| EntityResponseDTO\>

update the Entity with the given id with fields in the DTO, return updated Entity

**`throws`** Error if update fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | *string* | entity id |
| `entity` | EntityRequestDTO | Updated Entity |

**Returns:** *Promise*<``null`` \| EntityResponseDTO\>

the updated Entity

Defined in: IEntityService.ts:50

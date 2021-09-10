---
layout: default
title: TypeScript FileStorageService Docs
nav_order: 2
parent: File Storage
---

# TypeScript FileStorageService Documentation

### Methods

- [createFile](typescript-file-storage-service.md#createfile)
- [deleteFile](typescript-file-storage-service.md#deletefile)
- [getFile](typescript-file-storage-service.md#getfile)
- [updateFile](typescript-file-storage-service.md#updatefile)


### createFile

▸ **createFile**(`fileName`: *string*, `filePath`: *string*, `contentType?`: *string \| null*): *Promise*<void\>

Creates file

**`throws`** Error if name of file already exists

**`throws`** Error if file is not uploaded

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileName` | `string` | name of file |
| `filePath` | `string` | path of file |
| `contentType?` | ``null`` \| `string` | MIME type of file |

**Returns:** *Promise*<void\>

___

### deleteFile

▸ **deleteFile**(`fileName`: *string*): Promise<void\>

Deletes file

**`throws`** Error if name of file does not exist

**`throws`** Error if file is not deleted

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileName` | `string` | name of file |

**Returns:** *Promise*<void\>

___

### getFile

▸ **getFile**(`fileName`: *string*, `expirationTimeMinutes?`: *number*): *Promise*<string\>

Retrieves file

**`throws`** Error if file is not retrieved

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileName` | `string` | name of file |
| `expirationTimeMinutes?` | `number` | expiration time in minutes for generated URL |

**Returns:** *Promise*<string\>

Signed URL to file

___

### updateFile

▸ **updateFile**(`fileName`: *string*, `filePath`: *string*, `contentType?`: *string \| null*): Promise<void\>

Updates file

**`throws`** Error if name of file does not exist

**`throws`** Error if file is not updated

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileName` | `string` | name of file |
| `filePath` | `string` | path to file |
| `contentType?` | ``null`` \| `string` | MIME type of file |

**Returns:** *Promise*<void\>

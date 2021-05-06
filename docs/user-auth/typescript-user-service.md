---
layout: default
title: TypeScript UserService Docs
nav_order: 3
parent: User Auth
---

# TypeScript UserService Documentation

### Methods

- [createUser](typescript-user-service.md#createuser)
- [deleteUserByEmail](typescript-user-service.md#deleteuserbyemail)
- [deleteUserById](typescript-user-service.md#deleteuserbyid)
- [getAuthIdById](typescript-user-service.md#getauthidbyid)
- [getUserByEmail](typescript-user-service.md#getuserbyemail)
- [getUserById](typescript-user-service.md#getuserbyid)
- [getUserIdByAuthId](typescript-user-service.md#getuseridbyauthid)
- [getUserRoleByAuthId](typescript-user-service.md#getuserrolebyauthid)
- [getUsers](typescript-user-service.md#getusers)
- [updateUserById](typescript-user-service.md#updateuserbyid)


### createUser

▸ **createUser**(`user`: CreateUserDTO): *Promise*<UserDTO\>

Create a user, email verification configurable

**`throws`** Error if user creation fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `user` | CreateUserDTO | the user to be created |

**Returns:** *Promise*<UserDTO\>

a UserDTO with the created user's information

Defined in: userService.ts:57

___

### deleteUserByEmail

▸ **deleteUserByEmail**(`email`: *string*): *Promise*<void\>

Delete a user by email

**`throws`** Error if user deletion fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | *string* | user's email |

**Returns:** *Promise*<void\>

Defined in: userService.ts:81

___

### deleteUserById

▸ **deleteUserById**(`userId`: *string*): *Promise*<void\>

Delete a user by id

**`throws`** Error if user deletion fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | *string* | user's userId |

**Returns:** *Promise*<void\>

Defined in: userService.ts:74

___

### getAuthIdById

▸ **getAuthIdById**(`userId`: *string*): *Promise*<string\>

Get authId of user associated with id

**`throws`** Error if user authId retrieval fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | *string* | user's id |

**Returns:** *Promise*<string\>

user's authId

Defined in: userService.ts:42

___

### getUserByEmail

▸ **getUserByEmail**(`email`: *string*): *Promise*<UserDTO\>

Get user associated with email

**`throws`** Error if user retrieval fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | *string* | user's email |

**Returns:** *Promise*<UserDTO\>

a UserDTO with user's information

Defined in: userService.ts:18

___

### getUserById

▸ **getUserById**(`userId`: *string*): *Promise*<UserDTO\>

Get user associated with id

**`throws`** Error if user retrieval fails

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | *string* |

**Returns:** *Promise*<UserDTO\>

a UserDTO with user's information

Defined in: userService.ts:10

___

### getUserIdByAuthId

▸ **getUserIdByAuthId**(`authId`: *string*): *Promise*<string\>

Get id of user associated with authId

**`throws`** Error if user id retrieval fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `authId` | *string* | user's authId |

**Returns:** *Promise*<string\>

id of the user

Defined in: userService.ts:34

___

### getUserRoleByAuthId

▸ **getUserRoleByAuthId**(`authId`: *string*): *Promise*<Role\>

Get role of user associated with authId

**`throws`** Error if user role retrieval fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `authId` | *string* | user's authId |

**Returns:** *Promise*<Role\>

role of the user

Defined in: userService.ts:26

___

### getUsers

▸ **getUsers**(): *Promise*<UserDTO[]\>

Get all user information (possibly paginated in the future)

**`throws`** Error if user retrieval fails

**Returns:** *Promise*<UserDTO[]\>

array of UserDTOs

Defined in: userService.ts:49

___

### updateUserById

▸ **updateUserById**(`userId`: *string*, `user`: UpdateUserDTO): *Promise*<UserDTO\>

Update a user.
Note: the password cannot be updated using this method, use IAuthService.resetPassword instead

**`throws`** Error if user update fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | *string* | user's id |
| `user` | UpdateUserDTO | the user to be updated |

**Returns:** *Promise*<UserDTO\>

a UserDTO with the updated user's information

Defined in: userService.ts:67

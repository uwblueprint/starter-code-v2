---
layout: default
title: TypeScript AuthService Docs
nav_order: 4
parent: User Auth
---

# TypeScript AuthService Documentation

### Methods

- [generateToken](default.md#generatetoken)
- [isAuthorizedByEmail](default.md#isauthorizedbyemail)
- [isAuthorizedByRole](default.md#isauthorizedbyrole)
- [isAuthorizedByUserId](default.md#isauthorizedbyuserid)
- [renewToken](default.md#renewtoken)
- [resetPassword](default.md#resetpassword)
- [revokeTokens](default.md#revoketokens)


### generateToken

▸ **generateToken**(`email`: *string*, `password`: *string*): *Promise*<AuthDTO\>

Generate a short-lived JWT access token and a long-lived refresh token
when supplied user's email and password

**`throws`** Error if token generation fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | *string* | user's email |
| `password` | *string* | user's password |

**Returns:** *Promise*<AuthDTO\>

AuthDTO object containing the access token, refresh token, and user info

Defined in: authService.ts:12

___

### isAuthorizedByEmail

▸ **isAuthorizedByEmail**(`accessToken`: *string*, `requestedEmail`: *string*): *Promise*<boolean\>

Determine if the provided access token is valid and issued to the requested user
with the specified email address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `accessToken` | *string* | user's access token |
| `requestedEmail` | *string* | email address of requested user |

**Returns:** *Promise*<boolean\>

true if token valid and authorized, false otherwise

Defined in: authService.ts:64

___

### isAuthorizedByRole

▸ **isAuthorizedByRole**(`accessToken`: *string*, `roles`: *Set*<Role\>): *Promise*<boolean\>

Determine if the provided access token is valid and authorized for at least
one of the specified roles

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `accessToken` | *string* | user's access token |
| `roles` | *Set*<Role\> | roles to check for |

**Returns:** *Promise*<boolean\>

true if token valid and authorized, false otherwise

Defined in: authService.ts:44

___

### isAuthorizedByUserId

▸ **isAuthorizedByUserId**(`accessToken`: *string*, `requestedUserId`: *string*): *Promise*<boolean\>

Determine if the provided access token is valid and issued to the requested user

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `accessToken` | *string* | user's access token |
| `requestedUserId` | *string* | userId of requested user |

**Returns:** *Promise*<boolean\>

true if token valid and authorized, false otherwise

Defined in: authService.ts:52

___

### renewToken

▸ **renewToken**(`refreshToken`: *string*): *Promise*<Token\>

Generate new access and refresh token pair using the provided refresh token

**`throws`** Error if token renewal fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `refreshToken` | *string* | refresh token |

**Returns:** *Promise*<Token\>

Token object containing new access and refresh tokens

Defined in: authService.ts:27

___

### resetPassword

▸ **resetPassword**(`email`: *string*): *Promise*<void\>

Generate a password reset link for the user with the given email and send
the link to that that email address

**`throws`** Error if unable to generate link or send email

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | *string* | email of user requesting password reset |

**Returns:** *Promise*<void\>

Defined in: authService.ts:35

___

### revokeTokens

▸ **revokeTokens**(`userId`: *string*): *Promise*<void\>

Revoke all refresh tokens of a user

**`throws`** Error if token revocation fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userId` | *string* | userId of user whose refresh tokens are to be revoked |

**Returns:** *Promise*<void\>

Defined in: authService.ts:19

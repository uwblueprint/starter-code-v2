---
layout: default
title: TypeScript AuthService Docs
nav_order: 4
parent: User Auth
---

# TypeScript AuthService Documentation

### Methods

- [generateToken](typescript-auth-service.md#generatetoken)
- [generateTokenOAuth](typescript-auth-service.md#generatetokenoauth)
- [isAuthorizedByEmail](typescript-auth-service.md#isauthorizedbyemail)
- [isAuthorizedByRole](typescript-auth-service.md#isauthorizedbyrole)
- [isAuthorizedByUserId](typescript-auth-service.md#isauthorizedbyuserid)
- [renewToken](typescript-auth-service.md#renewtoken)
- [resetPassword](typescript-auth-service.md#resetpassword)
- [revokeTokens](typescript-auth-service.md#revoketokens)
- [sendEmailVerificationLink](typescript-auth-service.md#sendemailverificationlink)


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

___

### generateTokenOAuth

▸ **generateTokenOAuth**(`idToken`: *string*): *Promise*<AuthDTO\>

Generate a short-lived JWT access token and a long-lived refresh token when supplied OAuth ID token

**`throws`** Error if token generation fails

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `idToken` | *string* | user's ID token |

**Returns:** *Promise*<AuthDTO\>

AuthDTO object containing the access token, refresh token, and user info

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

___

### resetPassword

▸ **resetPassword**(`email`: *string*): *Promise*<void\>

Generate a password reset link for the user with the given email and send the link to that email address

**`throws`** Error if unable to generate link or send email

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | *string* | email of user requesting password reset |

**Returns:** *Promise*<void\>

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

___

### sendEmailVerificationLink

▸ **sendEmailVerificationLink**(`email`: *string*): Promise<void\>

Generate an email verification link for the user with the given email and send the link to that email address

**`throws`** Error if unable to generate link or send email

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | email of user that needs to be verified |

**Returns:** *Promise*<void\>

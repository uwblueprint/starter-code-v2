---
layout: default
title: Python AuthService Docs
nav_order: 2
parent: User Auth
---

# Python AuthService Documentation

### Methods
* [generate\_token](#interfaces.auth_service.IAuthService.generate_token)
* [revoke\_tokens](#interfaces.auth_service.IAuthService.revoke_tokens)
* [renew\_token](#interfaces.auth_service.IAuthService.renew_token)
* [reset\_password](#interfaces.auth_service.IAuthService.reset_password)
* [is\_authorized\_by\_role](#interfaces.auth_service.IAuthService.is_authorized_by_role)
* [is\_authorized\_by\_user\_id](#interfaces.auth_service.IAuthService.is_authorized_by_user_id)
* [is\_authorized\_by\_email](#interfaces.auth_service.IAuthService.is_authorized_by_email)

<a name="interfaces.auth_service.IAuthService.generate_token"></a>
#### generate\_token

```python
generate_token(email, password)
```

Generate a short-lived JWT access token and a long-lived refresh token
when supplied user's email and password

**Arguments**:

- `email`: user's email
- :type email: str
- `password`: user's password
- :type password: str

**Returns**:

AuthDTO object containing the access token, refresh token, and user info (:rtype: AuthDTO)

**Raises**:

- `Exception`: if token generation fails

<a name="interfaces.auth_service.IAuthService.revoke_tokens"></a>
#### revoke\_tokens

```python
revoke_tokens(user_id)
```

Revoke all refresh tokens of a user

**Arguments**:

- `user_id`: user_id of user whose refresh tokens are to be revoked
- :type user_id: str

**Raises**:

- `Exception`: if token revocation fails

<a name="interfaces.auth_service.IAuthService.renew_token"></a>
#### renew\_token

```python
renew_token(refresh_token)
```

Generate new access and refresh token pair using the provided refresh token

**Arguments**:

- `refresh_token`: user's refresh token
- :type refresh_token: str

**Returns**:

Token object containing new access and refresh tokens (:rtype: Token)

**Raises**:

- `Exception`: if token renewal fails

<a name="interfaces.auth_service.IAuthService.reset_password"></a>
#### reset\_password

```python
reset_password(email)
```

Generates a password reset link for the user with the given email
and sends the reset link to that email address

**Arguments**:

- `email`: email of user requesting password reset
- :type email: str

**Raises**:

- `Exception`: if unable to generate link or send email

<a name="interfaces.auth_service.IAuthService.is_authorized_by_role"></a>
#### is\_authorized\_by\_role

```python
is_authorized_by_role(access_token, roles)
```

Determine if the provided access token is valid and authorized for at least
one of the specified roles

**Arguments**:

- `access_token`: user's access token
- :type access_token: str
- `roles`: roles to check for
- :type roles: {str}

**Returns**:

true if token valid and authorized, false otherwise (:rtype: bool)

<a name="interfaces.auth_service.IAuthService.is_authorized_by_user_id"></a>
#### is\_authorized\_by\_user\_id

```python
is_authorized_by_user_id(access_token, requested_user_id)
```

Determine if the provided access token is valid and issued to the requested user

**Arguments**:

- `access_token`: user's access token
- :type access_token: str
- `requested_user_id`: user_id of the requested user
- :type requested_user_id: str

**Returns**:

true if token valid and authorized, false otherwise (:rtype: bool)

<a name="interfaces.auth_service.IAuthService.is_authorized_by_email"></a>
#### is\_authorized\_by\_email

```python
is_authorized_by_email(access_token, requested_email)
```

Determine if the provided access token is valid and issued to the requested user
with the specified email address

**Arguments**:

- `access_token`: user's access token
- :type access_token: str
- `requested_email`: email address of the requested user
- :type requested_email: str

**Returns**:

true if token valid and authorized, false otherwise (:rtype: bool)


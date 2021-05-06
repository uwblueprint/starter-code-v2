---
layout: default
title: Python UserService Docs
nav_order: 1
parent: User Auth
---

# Python UserService Documentation

### Methods
* [get\_user\_by\_id](#interfaces.user_service.IUserService.get_user_by_id)
* [get\_user\_by\_email](#interfaces.user_service.IUserService.get_user_by_email)
* [get\_user\_role\_by\_auth\_id](#interfaces.user_service.IUserService.get_user_role_by_auth_id)
* [get\_user\_id\_by\_auth\_id](#interfaces.user_service.IUserService.get_user_id_by_auth_id)
* [get\_auth\_id\_by\_user\_id](#interfaces.user_service.IUserService.get_auth_id_by_user_id)
* [get\_users](#interfaces.user_service.IUserService.get_users)
* [create\_user](#interfaces.user_service.IUserService.create_user)
* [update\_user\_by\_id](#interfaces.user_service.IUserService.update_user_by_id)
* [delete\_user\_by\_id](#interfaces.user_service.IUserService.delete_user_by_id)
* [delete\_user\_by\_email](#interfaces.user_service.IUserService.delete_user_by_email)


<a name="interfaces.user_service.IUserService.get_user_by_id"></a>
#### get\_user\_by\_id

```python
get_user_by_id(user_id)
```

Get user associated with user_id

**Arguments**:

- `user_id`: user's id
- :type user_id: str

**Returns**:

a UserDTO with user's information (:rtype: UserDTO)

**Raises**:

- `Exception`: if user retrieval fails

<a name="interfaces.user_service.IUserService.get_user_by_email"></a>
#### get\_user\_by\_email

```python
get_user_by_email(email)
```

Get user associated with email

**Arguments**:

- `email`: user's email
- :type email: str

**Returns**:

a UserDTO with user's information (:rtype: UserDTO)

**Raises**:

- `Exception`: if user retrieval fails

<a name="interfaces.user_service.IUserService.get_user_role_by_auth_id"></a>
#### get\_user\_role\_by\_auth\_id

```python
get_user_role_by_auth_id(auth_id)
```

Get role of user associated with auth_id

**Arguments**:

- `auth_id`: user's auth_id
- :type auth_id: str

**Returns**:

role of the user (:rtype: str)

**Raises**:

- `Exception`: if user role retrieval fails

<a name="interfaces.user_service.IUserService.get_user_id_by_auth_id"></a>
#### get\_user\_id\_by\_auth\_id

```python
get_user_id_by_auth_id(auth_id)
```

Get id of user associated with auth_id

**Arguments**:

- `auth_id`: user's auth_id
- :type auth_id: str

**Returns**:

id of the user (:rtype: str)

**Raises**:

- `Exception`: if user_id retrieval fails

<a name="interfaces.user_service.IUserService.get_auth_id_by_user_id"></a>
#### get\_auth\_id\_by\_user\_id

```python
get_auth_id_by_user_id(user_id)
```

Get auth_id of user associated with user_id

**Arguments**:

- `user_id`: user's id
- :type user_id: str

**Returns**:

auth_id of the user (:rtype: str)

**Raises**:

- `Exception`: if auth_id retrieval fails

<a name="interfaces.user_service.IUserService.get_users"></a>
#### get\_users

```python
get_users()
```

Get all users (possibly paginated in the future)

**Returns**:

list of UserDTOs (:rtype: [UserDTO])

**Raises**:

- `Exception`: if user retrieval fails

<a name="interfaces.user_service.IUserService.create_user"></a>
#### create\_user

```python
create_user(user)
```

Create a user, email verification configurable

**Arguments**:

- `user`: the user to be created
- :type user: CreateUserDTO

**Returns**:

the created user (:rtype: UserDTO)

**Raises**:

- `Exception`: if user creation fails

<a name="interfaces.user_service.IUserService.update_user_by_id"></a>
#### update\_user\_by\_id

```python
update_user_by_id(user_id, user)
```

Update a user
Note: the password cannot be updated using this method, use `IAuthService.reset_password` instead

**Arguments**:

- `user_id`: user's id
- :type user_id: str
- `user`: the user to be updated
- :type user: UpdateUserDTO

**Returns**:

the updated user (:rtype: UserDTO)

**Raises**:

- `Exception`: if user update fails

<a name="interfaces.user_service.IUserService.delete_user_by_id"></a>
#### delete\_user\_by\_id

```python
delete_user_by_id(user_id)
```

Delete a user by user_id

**Arguments**:

- `user_id`: user_id of user to be deleted
- :type user_id: str

**Raises**:

- `Exception`: if user deletion fails

<a name="interfaces.user_service.IUserService.delete_user_by_email"></a>
#### delete\_user\_by\_email

```python
delete_user_by_email(email)
```

Delete a user by email

**Arguments**:

- `email`: email of user to be deleted
- :type email: str

**Raises**:

- `Exception`: if user deletion fails

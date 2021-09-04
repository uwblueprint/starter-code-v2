from abc import ABC, abstractmethod


class IUserService(ABC):
    """
    UserService interface with user management methods
    """

    @abstractmethod
    def get_user_by_id(self, user_id):
        """
        Get user associated with user_id

        :param user_id: user's id
        :type user_id: str
        :return: a UserDTO with user's information
        :rtype: UserDTO
        :raises Exception: if user retrieval fails
        """
        pass

    @abstractmethod
    def get_user_by_email(self, email):
        """
        Get user associated with email

        :param email: user's email
        :type email: str
        :return: a UserDTO with user's information
        :rtype: UserDTO
        :raises Exception: if user retrieval fails
        """
        pass

    @abstractmethod
    def get_user_role_by_auth_id(self, auth_id):
        """
        Get role of user associated with auth_id

        :param auth_id: user's auth_id
        :type auth_id: str
        :return: role of the user
        :rtype: str
        :raises Exception: if user role retrieval fails
        """
        pass

    @abstractmethod
    def get_user_id_by_auth_id(self, auth_id):
        """
        Get id of user associated with auth_id

        :param auth_id: user's auth_id
        :type auth_id: str
        :return: id of the user
        :rtype: str
        :raises Exception: if user_id retrieval fails
        """
        pass

    @abstractmethod
    def get_auth_id_by_user_id(self, user_id):
        """
        Get auth_id of user associated with user_id

        :param user_id: user's id
        :type user_id: str
        :return: auth_id of the user
        :rtype: str
        :raises Exception: if auth_id retrieval fails
        """
        pass

    @abstractmethod
    def get_users(self):
        """
        Get all users (possibly paginated in the future)

        :return: list of UserDTOs
        :rtype: [UserDTO]
        :raises Exception: if user retrieval fails
        """
        pass

    @abstractmethod
    def create_user(self, user, auth_id=None, signup_method="PASSWORD"):
        """
        Create a user, email verification configurable

        :param user: the user to be created
        :type user: CreateUserDTO
        :param auth_id: user's firebase auth id, defaults to None
        :type auth_id: string, optional
        :param signup_method: method of signup, either "PASSWORD" or "GOOGLE", defaults to "PASSWORD"
        :type signup_method: str, optional
        :return: the created user
        :rtype: UserDTO
        :raises Exception: if user creation fails
        """
        pass

    @abstractmethod
    def update_user_by_id(self, user_id, user):
        """
        Update a user
        Note: the password cannot be updated using this method, use IAuthService.reset_password instead

        :param user_id: user's id
        :type user_id: str
        :param user: the user to be updated
        :type user: UpdateUserDTO
        :return: the updated user
        :rtype: UserDTO
        :raises Exception: if user update fails
        """
        pass

    @abstractmethod
    def delete_user_by_id(self, user_id):
        """
        Delete a user by user_id

        :param user_id: user_id of user to be deleted
        :type user_id: str
        :raises Exception: if user deletion fails
        """
        pass

    @abstractmethod
    def delete_user_by_email(self, email):
        """
        Delete a user by email

        :param str email: email of user to be deleted
        :type email: str
        :raises Exception: if user deletion fails
        """
        pass

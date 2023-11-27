import firebase_admin.auth

from ..interfaces.user_service import IUserService
from ...models.user_mg import User
from ...resources.user_dto import UserDTO


class UserService(IUserService):
    """
    UserService implementation with user management methods
    """

    def __init__(self, logger):
        """
        Create an instance of UserService

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger

    def get_user_by_id(self, user_id):
        try:
            user = User.objects(id=user_id).first()

            if not user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            firebase_user = firebase_admin.auth.get_user(user.auth_id)

            user_dict = UserService.__user_to_serializable_dict_and_remove_auth_id(user)
            user_dict["email"] = firebase_user.email

            return UserDTO(**user_dict)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_by_email(self, email):
        try:
            firebase_user = firebase_admin.auth.get_user_by_email(email)
            user = User.objects(auth_id=firebase_user.uid).first()

            if not user:
                raise Exception(
                    "user with auth_id {auth_id} not found".format(
                        auth_id=firebase_user.uid
                    )
                )

            user_dict = UserService.__user_to_serializable_dict_and_remove_auth_id(user)
            user_dict["email"] = firebase_user.email

            return UserDTO(**user_dict)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_role_by_auth_id(self, auth_id):
        try:
            user = self.__get_user_by_auth_id(auth_id)
            return user.role
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user role. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_user_id_by_auth_id(self, auth_id):
        try:
            user = self.__get_user_by_auth_id(auth_id)
            return str(user.id)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get user id. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_auth_id_by_user_id(self, user_id):
        try:
            user = User.objects(id=user_id).first()

            if not user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            return user.auth_id
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to get auth_id. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_users(self):
        user_dtos = []
        for user in User.objects:
            user_dict = UserService.__user_to_serializable_dict_and_remove_auth_id(user)

            try:
                firebase_user = firebase_admin.auth.get_user(user.auth_id)
                user_dict["email"] = firebase_user.email
                user_dtos.append(UserDTO(**user_dict))
            except Exception as e:
                self.logger.error(
                    "User with auth_id {auth_id} could not be fetched from Firebase".format(
                        auth_id=user.auth_id
                    )
                )
                raise e

        return user_dtos

    def create_user(self, user, auth_id=None, signup_method="PASSWORD"):
        new_user = None
        firebase_user = None

        try:
            if signup_method == "PASSWORD":
                firebase_user = firebase_admin.auth.create_user(
                    email=user.email, password=user.password
                )
            elif signup_method == "GOOGLE":
                # If they signup with Google OAuth, a Firebase user is automatically created
                firebase_user = firebase_admin.auth.get_user(uid=auth_id)

            try:
                new_user = User(
                    first_name=user.first_name,
                    last_name=user.last_name,
                    auth_id=firebase_user.uid,
                    role=user.role,
                ).save()
            except Exception as mongo_error:
                # rollback user creation in Firebase
                try:
                    firebase_admin.auth.delete_user(firebase_user.uid)
                except Exception as firebase_error:
                    reason = getattr(firebase_error, "message", None)
                    error_message = [
                        "Failed to rollback Firebase user creation after MongoDB user creation failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(firebase_error))
                        ),
                        "Orphaned auth_id (Firebase uid) = {auth_id}".format(
                            auth_id=firebase_user.uid
                        ),
                    ]
                    self.logger.error(" ".join(error_message))

                raise mongo_error
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to create user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        new_user_dict = UserService.__user_to_serializable_dict_and_remove_auth_id(
            new_user
        )
        new_user_dict["email"] = firebase_user.email
        return UserDTO(**new_user_dict)

    def update_user_by_id(self, user_id, user):
        try:
            update_user_dict = user.__dict__
            email = update_user_dict.pop("email", None)

            # workaround for running validations since modify() does not automatically run them
            # auth_id is a placeholder because it is not part of the UpdateUserDTO
            User(auth_id="", **update_user_dict).validate()

            old_user = User.objects(id=user_id).modify(new=False, **update_user_dict)

            if not old_user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            # IMPORTANT: update_user_dict references the same instance of UpdateUserDTO as user
            update_user_dict["email"] = email

            try:
                firebase_admin.auth.update_user(old_user.auth_id, email=user.email)
            except Exception as firebase_error:
                try:
                    # rollback MongoDB user update
                    User.objects(id=user_id).modify(
                        first_name=old_user.first_name,
                        last_name=old_user.last_name,
                        role=old_user.role,
                    )
                except Exception as mongo_error:
                    reason = getattr(mongo_error, "message", None)
                    error_message = [
                        "Failed to rollback MongoDB user update after Firebase user update failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(mongo_error))
                        ),
                        "MongoDB user id with possibly inconsistent data = {user_id}".format(
                            user_id=user_id
                        ),
                    ]
                    self.logger.error(" ".join(error_message))

                raise firebase_error
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to update user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        return UserDTO(user_id, user.first_name, user.last_name, user.email, user.role)

    def delete_user_by_id(self, user_id):
        try:
            deleted_user = User.objects(id=user_id).modify(remove=True, new=False)

            if not deleted_user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            try:
                firebase_admin.auth.delete_user(deleted_user.auth_id)
            except Exception as firebase_error:
                # rollback MongoDB user deletion
                try:
                    User(
                        first_name=deleted_user.first_name,
                        last_name=deleted_user.last_name,
                        auth_id=deleted_user.auth_id,
                        role=deleted_user.role,
                    ).save()
                except Exception as mongo_error:
                    reason = getattr(mongo_error, "message", None)
                    error_message = [
                        "Failed to rollback MongoDB user deletion after Firebase user deletion failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(mongo_error))
                        ),
                        "Firebase uid with non-existent MongoDB record = {auth_id}".format(
                            auth_id=deleted_user.auth_id
                        ),
                    ]
                    self.logger.error(" ".join(error_message))

                raise firebase_error
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to delete user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def delete_user_by_email(self, email):
        try:
            firebase_user = firebase_admin.auth.get_user_by_email(email)
            deleted_user = User.objects(auth_id=firebase_user.uid).modify(
                remove=True, new=False
            )

            if not deleted_user:
                raise Exception(
                    "auth_id (Firebase uid) {auth_id} not found".format(
                        auth_id=firebase_user.uid
                    )
                )

            try:
                firebase_admin.auth.delete_user(firebase_user.uid)
            except Exception as firebase_error:
                try:
                    User(
                        first_name=deleted_user.first_name,
                        last_name=deleted_user.last_name,
                        auth_id=deleted_user.auth_id,
                        role=deleted_user.role,
                    ).save()
                except Exception as mongo_error:
                    reason = getattr(mongo_error, "message", None)
                    error_message = [
                        "Failed to rollback MongoDB user deletion after Firebase user deletion failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(mongo_error))
                        ),
                        "Firebase uid with non-existent MongoDB record = {auth_id}".format(
                            auth_id=deleted_user.auth_id
                        ),
                    ]
                    self.logger.error(" ".join(error_message))

                raise firebase_error
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to delete user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def __get_user_by_auth_id(self, auth_id):
        """
        Get a User document by auth_id

        :param auth_id: the user's auth_id (Firebase uid)
        :type auth_id: str
        """
        user = User.objects(auth_id=auth_id).first()

        if not user:
            raise Exception(
                "user with auth_id {auth_id} not found".format(auth_id=auth_id)
            )

        return user

    @staticmethod
    def __user_to_serializable_dict_and_remove_auth_id(user):
        """
        Convert a User document to a serializable dict and remove the
        auth id field

        :param user: the user
        :type user: User
        """
        user_dict = user.to_serializable_dict()
        user_dict.pop("auth_id", None)
        return user_dict

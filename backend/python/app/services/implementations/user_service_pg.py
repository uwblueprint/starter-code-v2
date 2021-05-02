import firebase_admin.auth

from ..interfaces.user_service import IUserService
from ...models.user_pg import User
from ...models import db
from ...resources.user_dto import UserDTO

class UserService(IUserService):
    def __init__(self, logger):
        self.logger = logger

    def get_user_by_id(self, user_id):
        try:
            user = User.query.get(user_id)

            if not user:
                raise Exception("user_id {user_id} not found".format(user_id))
            
            firebase_user = firebase_admin.auth.get_user(user.auth_id)

            user_dict = UserService.__user_to_dict_and_remove_auth_id(user)
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
            user = User.query.filter_by(auth_id=firebase_user.uid).first()

            if not user:
                raise Exception(
                    "user with auth_id {auth_id} not found".format(
                        auth_id=firebase_user.uid
                    )
                )

            user_dict = UserService.__user_to_dict_and_remove_auth_id(user)
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
            user = User.query.get(user_id).first()

            if not user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            return user.auth_id
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "failed to get auth_id. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

    def get_users(self):
        user_dtos = []
        user_list = [result for result in User.query.all()]
        for user in user_list:
            user_dict = UserService.__user_to_dict_and_remove_auth_id(user)
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

    def create_user(self, user):
        new_user = None
        firebase_user = None

        try:
            firebase_user = firebase_admin.auth.create_user(
                email=user.email, password=user.password
            )

            postgres_user = {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "auth_id": firebase_user.uid,
                "role": user.role
            }

            try:
                new_user = User(**postgres_user)
                db.session.add(new_user)
                db.session.commit()
            except Exception as postgres_error:
                # rollback user creation in Firebase
                try:
                    firebase_admin.auth.delete_user(firebase_user.uid)
                except Exception as firebase_error:
                    reason = getattr(firebase_error, "message", None)
                    error_message = [
                        "Failed to rollback Firebase user creation after MongoDB user creation failed.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(firebase_error))
                        ),
                        "Orphaned auth_id (Firebase uid) = {auth_id}".format(
                            auth_id=firebase_user.uid
                        ),
                    ]
                    self.logger.error(" ".join(error_message))
                raise postgres_error

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to create user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e
        
        new_user_dict = UserService.__user_to_dict_and_remove_auth_id(
            new_user
        )
        new_user_dict["email"] = firebase_user.email
        return UserDTO(**new_user_dict)

    def update_user_by_id(self, user_id, user):
        try:
            old_user = User.query.get(user_id)

            if not old_user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            test = User.query.filter_by(id=user_id).update(
                {
                    User.first_name: user.first_name,
                    User.last_name: user.last_name,
                    User.role: user.role
                })

            db.session.commit()

            try:
                firebase_admin.auth.update_user(old_user.auth_id, email=user.email)
            except Exception as firebase_error:
                try:
                    old_user_dict = {
                        User.first_name: old_user.first_name,
                        User.last_name: old_user.last_name,
                        User.role: old_user.role
                    }
                    User.query.filter_by(id=user_id).update(**old_user_dict)
                    db.session.commit()

                except Exception as postgres_error:
                    reason = getattr(postgres_error, "message", None)
                    error_message = [
                        "Failed to rollback Postgres user update after Firebase user update failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(postgres_error))
                        ),
                        "Postgres user id with possibly inconsitent data = {user_id}".format(
                            user_id=user_id
                        ),
                    ]
                    self.logger.error(" ".join(error_message))
                
                raise firebase_error
        
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "failed to update user. Reason = {reason}".format(
                    reason=(reason if reason else str(e))
                )
            )
            raise e

        return UserDTO(user_id, user.first_name, user.last_name, user.email, user.role)


    def delete_user_by_id(self, user_id):
        try:
            deleted_user = User.query.get(user_id)

            if not deleted_user:
                raise Exception("user_id {user_id} not found".format(user_id=user_id))

            delete_count = User.query.filter_by(id=user_id).delete()

            if delete_count < 1:
                raise Exception("user_id {user_id} was not deleted".format(user_id=user_id))
            elif delete_count > 1:
                raise Exception("user_id {user_id} had multiple instances. Delete not committed.".format(user_id=user_id))
            
            db.session.commit()

            try:
                firebase_admin.auth.delete_user(deleted_user.auth_id)
            except Exception as firebase_error:
                # rollback Postgres user deletion
                try:
                    deleted_user_dict = {
                        "first_name": deleted_user.first_name,
                        "last_name": deleted_user.last_name,
                        "auth_id": deleted_user.auth_id,
                        "role": deleted_user.role
                    }

                    new_user = User(**new_user.__dict__)
                    db.session.add(new_user)
                    db.session.commit()

                except Exception as postgres_error:
                    reason = getattr(postgres_error, "message", None)
                    error_message = [
                        "Failed to rollback Postgres user deletion after Firebase user deletion failure.",
                        "Reason = {reason},".format(
                            reason=(reason if reason else str(postgres_error)),
                        ),
                        "Firebase uid with non-existent Postgres record ={auth_id}".format(
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
            deleted_user = User.query.filter_by(auth_id=firebase_user.uid).first()
        
            if not deleted_user:
                raise Exception(
                    "auth_id (Firebase uid) {auth_id} not found".format(
                        auth_id=firebase_user.uid
                    )
                )

            delete_count = User.query.filter_by(auth_id=firebase_user.uid).delete()
            
            if delete_count < 1:
                raise Exception("user_id {user_id} was not deleted".format(user_id=user_id))
            elif delete_count > 1:
                raise Exception("user_id {user_id} had multiple instances. Delete not committed.".format(user_id=user_id))
            
            db.session.commit()
            
            try:
                firebase_admin.auth.delete_user(firebase_user.uid)
            except Exception as firebase_error:
                try:
                    deleted_user_dict = {
                        "first_name": deleted_user.first_name,
                        "last_name": deleted_user.last_name,
                        "auth_id": deleted_user.auth_id,
                        "role": deleted_user.role
                    }
                    new_user = User(**new_user.__dict__)
                    db.session.add(new_user)
                    db.session.commit()

                except Exception as postgres_error:
                    reason = getattr(postgres_error, "message", None)
                    error_message = [
                        "Failed to rollback Postgres user deletion after Firebase user deletion failure.",
                        "Reason = {reason},".format(
                             reason=(reason if reason else str(postgres_error))
                        ),
                        "Firebase uid with non-existent Postgres record = {auth_id}".format(
                            auth_id=deleted_user.auth_id
                        )
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
        Get a user document by auth_id

        :param auth_id: the user's auth_id (Firebase uid)
        :type auth_id: str
        """
        user = User.query.filter_by(auth_id=auth_id).first()

        if not user:
            raise Exception(
                "user with auth_id {auth_id} not found".format(auth_id=auth_id)
            )
        
        return user

    @staticmethod
    def __user_to_dict_and_remove_auth_id(user):
        """
        Convert a User document to a serializable dict and remove the
        auth id field

        :param user: the user
        :type user: User
        """
        user_dict = user.to_dict()
        user_dict.pop("auth_id", None)
        return user_dict

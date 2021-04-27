import firebase_admin.auth

from ..interfaces.auth_service import IAuthService
from ...utilities.firebase_rest_client import FirebaseRestClient


class AuthService(IAuthService):
    """
    AuthService implementation with user authentication methods
    """

    def __init__(self, logger, user_service, email_service):
        """
        Create an instance of AuthService

        :param logger: application's logger instance
        :type logger: logger
        :param user_service: an user_service instance
        :type user_service: IUserService
        :param email_service: an email_service instance
        :type email_service: IEmailService
        """
        self.logger = logger
        self.user_service = user_service
        self.email_service = email_service
        self.firebase_rest_client = FirebaseRestClient(logger)

    def generate_token(self, email, password):
        try:
            return self.firebase_rest_client.sign_in_with_password(email, password)
        except Exception as e:
            self.logger.error(
                "Failed to generate token for user with email {email}".format(
                    email=email
                )
            )
            raise e

    def revoke_tokens(self, user_id):
        try:
            auth_id = self.user_service.get_auth_id_by_user_id(user_id)
            firebase_admin.auth.revoke_refresh_tokens(auth_id)
        except Exception as e:
            reason = getattr(e, "message", None)
            error_message = [
                "Failed to revoke refresh tokens of user with id {user_id}".format(
                    user_id=user_id
                ),
                "Reason =",
                (reason if reason else str(e)),
            ]
            self.logger.error(" ".join(error_message))
            raise e

    def renew_token(self, refresh_token):
        try:
            return self.firebase_rest_client.refresh_token(refresh_token)
        except Exception as e:
            self.logger.error("Failed to refresh token")
            raise e

    def reset_password(self, email):
        try:
            reset_link = firebase_admin.auth.generate_password_reset_link(email)
            email_body = """
                Hello,
                <br><br>
                We have received a password reset request for your account. 
                Please click the following link to reset it. 
                <strong>This link is only valid for 1 hour.</strong>
                <br><br>
                <a href={reset_link}>Reset Password</a>
                """.format(
                reset_link=reset_link
            )
            self.email_service.send_email(email, "Your Password Reset Link", email_body)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to send password reset link for {email}. Reason = {reason}".format(
                    email=email, reason=(reason if reason else str(e))
                )
            )
            raise e

    def is_authorized_by_role(self, access_token, roles):
        try:
            decoded_id_token = firebase_admin.auth.verify_id_token(
                access_token, check_revoked=True
            )
            user_role = self.user_service.get_user_role_by_auth_id(
                decoded_id_token["uid"]
            )
            return user_role in roles
        except:
            return False

    def is_authorized_by_user_id(self, access_token, requested_user_id):
        try:
            decoded_id_token = firebase_admin.auth.verify_id_token(
                access_token, check_revoked=True
            )
            token_user_id = self.user_service.get_user_id_by_auth_id(
                decoded_id_token["uid"]
            )
            return token_user_id == requested_user_id
        except:
            return False

    def is_authorized_by_email(self, access_token, requested_email):
        try:
            decoded_id_token = firebase_admin.auth.verify_id_token(
                access_token, check_revoked=True
            )
            return decoded_id_token["email"] == requested_email
        except:
            return False

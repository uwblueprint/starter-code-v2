import os
import requests

from ..resources.token import Token

FIREBASE_SIGN_IN_URL = (
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"
)
FIREBASE_REFRESH_TOKEN_URL = "https://securetoken.googleapis.com/v1/token"


class FirebaseRestClient:
    def __init__(self, logger):
        """
        Create an instance of FirebaseRestClient

        :param logger: the application's logger instance
        :type logger: logger
        """
        self.logger = logger

    # docs: https://firebase.google.com/docs/reference/rest/auth/#section-sign-in-email-password
    def sign_in_with_password(self, email, password):
        """
        Sign-in to Firebase using a email and password

        :param email: user's email
        :type email: str
        :param password: user's password
        :type password: str
        :return: access and refresh tokens
        :rtype: Token
        :raises Exception: if Firebase API call fails
        """
        headers = {"Content-Type": "application/json"}
        data = {"email": email, "password": password, "returnSecureToken": "true"}

        # IMPORTANT: must convert data to string as otherwise the payload will get URL-encoded
        # e.g. "@" in the email address will get converted to "%40" which is incorrect
        response = requests.post(
            "{base_url}?key={api_key}".format(
                base_url=FIREBASE_SIGN_IN_URL, api_key=os.getenv("FIREBASE_WEB_API_KEY")
            ),
            headers=headers,
            data=str(data),
        )

        response_json = response.json()

        if response.status_code != 200:
            error_message = [
                "Failed to sign-in via Firebase REST API, status code =",
                str(response.status_code),
                "error message =",
                response_json["error"]["message"],
            ]
            self.logger.error(" ".join(error_message))

            raise Exception("Failed to sign-in via Firebase REST API")

        return Token(response_json["idToken"], response_json["refreshToken"])

    # docs: https://firebase.google.com/docs/reference/rest/auth/#section-refresh-token
    def refresh_token(self, ref_token):
        """
        Refresh a user's access and refresh tokens

        :param ref_token: user's current refresh token
        :type ref_token: str
        :return: access and refresh tokens
        :rtype: Token
        :raises Exception: if Firebase API call fails
        """
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = "grant_type=refresh_token&refresh_token={refresh_token}".format(
            refresh_token=ref_token
        )

        response = requests.post(
            "{base_url}?key={api_key}".format(
                base_url=FIREBASE_REFRESH_TOKEN_URL,
                api_key=os.getenv("FIREBASE_WEB_API_KEY"),
            ),
            headers=headers,
            data=data,
        )

        response_json = response.json()

        if response.status_code != 200:
            error_message = [
                "Failed to refresh token via Firebase REST API, status code =",
                str(response.status_code),
                "error message =",
                response_json["error"]["message"],
            ]
            self.logger.error(" ".join(error_message))

            raise Exception("Failed to refresh token via Firebase REST API")

        return Token(response_json["id_token"], response_json["refresh_token"])

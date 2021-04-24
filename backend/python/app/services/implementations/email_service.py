import base64
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from ..interfaces.email_service import IEmailService


class EmailService(IEmailService):
    def __init__(self, credentials, sender_email, display_name=None):
        creds = Credentials(None, **credentials)
        self.service = build("gmail", "v1", credentials=creds)
        self.sender_email = sender_email
        if display_name:
            self.sender = "{name} <{email}>".format(
                name=display_name, email=sender_email
            )
        else:
            self.sender = sender_email

    def send_email(self, to, subject, body):
        message = MIMEText(body, "html")
        message["from"] = self.sender
        message["to"] = to
        message["subject"] = subject
        email = {"raw": base64.urlsafe_b64encode(message.as_string().encode()).decode()}
        try:
            sent_info = (
                self.service.users()
                .messages()
                .send(userId=self.sender_email, body=email)
                .execute()
            )
            return sent_info
        except Exception as err:
            # TODO: Add error logging
            raise err

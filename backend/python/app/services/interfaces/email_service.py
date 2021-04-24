from abc import ABC, abstractmethod


class IEmailService(ABC):
    """
    A class for handling email related functionality
    """

    @abstractmethod
    def send_email(self, to, subject, body):
        """
        Sends email with given parameters

        Args:
            to: recipient's email
            subject: email subject
            body: email body as html
        Returns:
            A dict that contains fields like id, threadId, labelIds
            of the sent email
        Raises:
            Error if email was not sent successfully
        """
        pass

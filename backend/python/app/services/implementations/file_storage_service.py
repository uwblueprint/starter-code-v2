from datetime import datetime, timedelta
from firebase_admin import storage

from ..interfaces.file_storage_service import IFileStorageService


class FileStorageService(IFileStorageService):
    """
    FileStorageService interface for handling blob storage
    """

    def __init__(self, logger):
        """
        Create an instance of FileStorageService with default bucket

        :param logger: application's logger instance
        :type logger: logger
        """
        self.logger = logger
        self.bucket = storage.bucket()

    def get_file(self, file_name, expiration_time=timedelta(minutes=60)):
        blob = self.bucket.get_blob(file_name)
        if not blob:
            return None
        expiration = datetime.now() + expiration_time
        url = blob.generate_signed_url(expiration)
        return url

    def create_file(self, file_name, file, content_type=None):
        current_blob = self.bucket.get_blob(file_name)
        if current_blob:
            raise Exception("File name {name} already exists".format(name=file_name))
        blob = self.bucket.blob(file_name)
        try:
            blob.upload_from_file(file, content_type=content_type)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to create file {name}. Reason = {reason}".format(
                    name=file_name, reason=(reason if reason else str(e))
                )
            )
            raise e

    def update_file(self, file_name, file, content_type=None):
        current_blob = self.bucket.get_blob(file_name)
        if not current_blob:
            raise Exception("File name {name} does not exist".format(name=file_name))
        blob = self.bucket.blob(file_name)
        try:
            blob.upload_from_file(file, content_type=content_type)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to update file {name}. Reason = {reason}".format(
                    name=file_name, reason=(reason if reason else str(e))
                )
            )
            raise e

    def delete_file(self, file_name):
        try:
            self.bucket.delete_blob(file_name)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                "Failed to delete file {name}. Reason = {reason}".format(
                    name=file_name, reason=(reason if reason else str(e))
                )
            )
            raise e

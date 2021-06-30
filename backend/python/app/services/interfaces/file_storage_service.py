from abc import ABC, abstractmethod
from datetime import timedelta


class IFileStorageService(ABC):
    """
    FileStorageService interface for handling blob storage
    """

    @abstractmethod
    def get_file(self, file_name, expiration_time=timedelta(minutes=60)):
        """
        Returns a signed url to the file with the given file name if found

        :param file_name: name of the file
        :type file_name: str
        :param expiration_time: the lifetime of the url, defaults to timedelta(minutes=60)
        :type expiration_time: timedelta, optional
        :return: signed url of the file
        :rtype: str or None if file is not found
        """
        pass

    @abstractmethod
    def create_file(self, file_name, file, content_type=None):
        """
        Creates a file in the default bucket with given file name

        :param file_name: name of the file
        :type file_name: str
        :param file: file to upload
        :type file: file
        :param content_type: MIME type of the file, defaults to None
        :type content_type: string, optional
        :raises Exception: file name already exists
        """
        pass

    @abstractmethod
    def update_file(self, file_name, file, content_type=None):
        """
        Replaces the file that has given file name in default bucket

        :param file_name: name of the file
        :type file_name: str
        :param file: file to replace with
        :type file: file
        :param content_type: MIME type of the file, defaults to None
        :type content_type: string, optional
        :raises Exception: file name does not already exist
        """
        pass

    @abstractmethod
    def delete_file(self, file_name):
        """
        Deletes the file with the given file name

        :param file_name: name of the file
        :type file_name: str
        :raises Exception: file not found
        """
        pass

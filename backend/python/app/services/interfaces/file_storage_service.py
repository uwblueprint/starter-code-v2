from abc import ABC, abstractclassmethod, abstractmethod


class IFileStorageService(ABC):
    """
    FileStorageService interface for handling blob storage
    """

    @abstractmethod
    def get_file(self, file_name):
        """
        Returns a signed url to the file with the given file name if found

        :param file_name: name of the file
        :type file_name: str
        :return: signed url of the file
        :rtype: str or None if file is not found
        """
        pass

    @abstractmethod
    def create_file(self, file_name, file):
        """
        Creates a file in the default bucket with given file name

        :param file_name: name of the file
        :type file_name: str
        :param file: file to upload
        :type file: file
        :return: signed url of the created file
        :rtype: str
        :raises Exception: file name already exists
        """
        pass

    @abstractmethod
    def update_file(self, file_name, file):
        """
        Replaces the file that has given file name in default bucket

        :param file_name: name of the file
        :type file_name: str
        :param file: file to replace with
        :type file: file
        :return: signed url of the updated file
        :rtype: str
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

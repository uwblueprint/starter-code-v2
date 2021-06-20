from abc import ABC, abstractclassmethod, abstractmethod

class IStorageService(ABC):
    """ 
    Interface innit
    """

    @abstractmethod
    def get_file(self, file_name):
        pass 

    @abstractmethod
    def create_file(self, file_name, file):
        pass 

    @abstractmethod
    def update_file(self, file_name, file):
        pass 

    @abstractmethod
    def delete_file(self, file_name):
        pass 


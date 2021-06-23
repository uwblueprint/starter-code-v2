import firebase_admin
from firebase_admin import storage
from google.cloud.storage import Blob
from datetime import datetime

from ..interfaces.storage_service import IStorageService

class StorageService(IStorageService):
    
    def __init__(self):
        self.bucket = storage.bucket()

    def get_file(self, file_name):
        blob = self.bucket.get_blob(file_name)
        print(blob)
        expiration = datetime(2021, 9, 1)
        url = blob.generate_signed_url(expiration)
        print(url)
        return url

    def create_file(self, file_name, file):
        blob = Blob(name=file_name, bucket=self.bucket)
        blob.upload_from_file(file)
        pass

    def update_file(self, file_name, file):
        blob = Blob(name=file_name, bucket=self.bucket)
        blob.upload_from_file(file)
        pass

    def delete_file(self, file_name):
        self.bucket.delete_blob(file_name)
        pass 




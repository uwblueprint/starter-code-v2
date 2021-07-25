from ..interfaces.file_storage_service import IFileStorageService
from ...models.entity_mg import Entity
from ..interfaces.entity_service import IEntityService
from uuid import uuid4


class EntityService(IEntityService):
    def __init__(self, logger, file_storage_service: IFileStorageService):
        self.logger = logger
        self.file_storage_service = file_storage_service

    def get_entities(self):
        entities = []

        for result in Entity.objects:
            result_dict = result.to_serializable_dict()
            entities.append(result_dict)

        return entities

    def get_entity(self, id):
        entity = Entity.objects.get(id=id)

        if entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")

        return entity.to_serializable_dict()

    def create_entity(self, entity, file, content_type):
        try:
            if file:
                file_name = file_name uuid4()
                self.file_storage_service.create_file(file_name, file, content_type)
                entity.file_name = file_name

            new_entity = Entity(**entity.__dict__)
            new_entity.save()
        except Exception as error:
            self.logger.error(str(error))
            raise error

        return new_entity.to_serializable_dict()

    def update_entity(self, id, entity, file, content_type):
        if file:
            self.file_storage_service.update_file(entity.file_name, file, content_type)
        updated_entity = Entity.objects(id=id).modify(new=True, **entity.__dict__)

        if updated_entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")

        return updated_entity.to_serializable_dict()

    def delete_entity(self, id):
        try:
            file_name = Entity.objects.get(id=id).file_name
            deleted = Entity.objects(id=id).modify(remove=True)
            file_name = deleted.file_name
            if deleted:
                self.file_storage_service.delete_file(file_name)
            return id
        except Exception as error:
            self.logger.error(str(error))
            raise error

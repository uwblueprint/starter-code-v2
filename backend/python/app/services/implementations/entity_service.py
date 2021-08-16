from ...models.entity import Entity
from ...models import db
from ..interfaces.entity_service import IEntityService
from ..interfaces.file_storage_service import IFileStorageService
from uuid import uuid4


class EntityService(IEntityService):
    def __init__(self, logger, file_storage_service: IFileStorageService):
        self.logger = logger
        self.file_storage_service = file_storage_service

    def get_entities(self):
        # Entity is a SQLAlchemy model, we can use convenient methods provided
        # by SQLAlchemy like query.all() to query the data
        return [result.to_dict() for result in Entity.query.all()]

    def get_entity(self, id):
        # get queries by the primary key, which is id for the Entity table
        entity = Entity.query.get(id)
        if entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")
        return entity.to_dict()

    def create_entity(self, entity):
        try:
            file_name = None
            if entity.file:
                file_name = str(uuid4())
                self.file_storage_service.create_file(
                    file_name, entity.file, entity.file.content_type
                )
            entity.__dict__.pop("file", None)
            new_entity = Entity(**entity.__dict__, file_name=file_name)
        except Exception as error:
            self.logger.error(str(error))
            raise error

        db.session.add(new_entity)
        # remember to commit to actually persist into the database
        db.session.commit()

        return new_entity.to_dict()

    def update_entity(self, id, entity):
        current_entity = Entity.query.get(id)

        if current_entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")

        file_name = current_entity.file_name
        if entity.file:
            if file_name:
                self.file_storage_service.update_file(
                    file_name, entity.file, entity.file.content_type
                )
            else:
                file_name = str(uuid4())
                self.file_storage_service.create_file(
                    file_name, entity.file, entity.file.content_type
                )
        elif file_name:
            self.file_storage_service.delete_file(file_name)
            file_name = None

        entity_dict = entity.__dict__
        entity_dict.pop("file", None)
        entity_dict.update({"file_name": file_name})

        Entity.query.filter_by(id=id).update(entity_dict)
        updated_entity = Entity.query.get(id)
        db.session.commit()

        if updated_entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")
        return updated_entity.to_dict()

    def delete_entity(self, id):
        deleted_entity = Entity.query.get(id)
        deleted = Entity.query.filter_by(id=id).delete()
        db.session.commit()

        # deleted is the number of rows deleted
        if deleted == 1:
            if deleted_entity.file_name:
                self.file_storage_service.delete_file(deleted_entity.file_name)
            return id

        self.logger.error("Invalid id")
        raise Exception("Invalid id")

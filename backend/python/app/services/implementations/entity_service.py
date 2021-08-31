# postgresql {
from ...models.entity import Entity
from ...models import db
from ..interfaces.entity_service import IEntityService
# file-storage {
from ..interfaces.file_storage_service import IFileStorageService
from uuid import uuid4
# } file-storage


class EntityService(IEntityService):
    # file-storage {
    def __init__(self, logger, file_storage_service: IFileStorageService):
    # } file-storage
    # no-file-storage {
    def __init__(self, logger):
    # } no-file-storage
        self.logger = logger
        # file-storage {
        self.file_storage_service = file_storage_service
        # } file-storage

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
            # file-storage {
            file_name = None
            if entity.file:
                file_name = str(uuid4())
                self.file_storage_service.create_file(
                    file_name, entity.file, entity.file.content_type
                )
            entity.__dict__.pop("file", None)
            new_entity = Entity(**entity.__dict__, file_name=file_name)
            # } file-storage
            # no-file-storage {
            new_entity = Entity(**entity.__dict__)
            # } no-file-storage
        except Exception as error:
            self.logger.error(str(error))
            raise error

        db.session.add(new_entity)
        # remember to commit to actually persist into the database
        db.session.commit()

        return new_entity.to_dict()

    def update_entity(self, id, entity):
        # file-storage {
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
        # } file-storage
        # no-file-storage {
        Entity.query.filter_by(id=id).update(entity.__dict__)
        # } no-file-storage
        updated_entity = Entity.query.get(id)
        db.session.commit()

        if updated_entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")
        return updated_entity.to_dict()

    def delete_entity(self, id):
        # file-storage {
        deleted_entity = Entity.query.get(id)
        # } file-storage
        deleted = Entity.query.filter_by(id=id).delete()
        db.session.commit()

        # deleted is the number of rows deleted
        if deleted == 1:
            # file-storage {
            if deleted_entity.file_name:
                self.file_storage_service.delete_file(deleted_entity.file_name)
            # } file-storage
            return id

        self.logger.error("Invalid id")
        raise Exception("Invalid id")

# } postgresql
# mongodb {
# file-storage {
from ..interfaces.file_storage_service import IFileStorageService
# } file-storage
from ...models.entity import Entity
from ..interfaces.entity_service import IEntityService
# file-storage {
from uuid import uuid4
# } file-storage


class EntityService(IEntityService):
    # file-storage {
    def __init__(self, logger, file_storage_service: IFileStorageService):
    # } file-storage
    # no-file-storage {
    def __init__(self, logger):
    # } no-file-storage
        self.logger = logger
        # file-storage {
        self.file_storage_service = file_storage_service
        # } file-storage

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

    def create_entity(self, entity):
        try:
            # file-storage {
            file_name = None
            if entity.file:
                file_name = str(uuid4())
                self.file_storage_service.create_file(
                    file_name, entity.file, entity.file.content_type
                )
            entity.__dict__.pop("file", None)
            new_entity = Entity(**entity.__dict__, file_name=file_name)
            # } file-storage
            # no-file-storage {
            new_entity = Entity(**entity.__dict__)
            # } no-file-storage
            new_entity.save()
        except Exception as error:
            self.logger.error(str(error))
            raise error

        return new_entity.to_serializable_dict()

    def update_entity(self, id, entity):
        # file-storage {
        current_entity = Entity.objects.get(id=id)
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

        entity.__dict__.pop("file", None)
        updated_entity = Entity.objects(id=id).modify(
            new=True, **entity.__dict__, file_name=file_name
        )
        # } file-storage
        # no-file-storage {
        updated_entity = Entity.objects(id=id).modify(new=True, **entity.__dict__)
        # } no-file-storage

        if updated_entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")

        return updated_entity.to_serializable_dict()

    def delete_entity(self, id):
        try:
            # file-storage {
            file_name = Entity.objects.get(id=id).file_name
            # } file-storage
            deleted = Entity.objects(id=id).modify(remove=True)
            # file-storage {
            if deleted:
                self.file_storage_service.delete_file(file_name)
            # } file-storage
            return id
        except Exception as error:
            self.logger.error(str(error))
            raise error

# } mongodb

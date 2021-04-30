# postgresql {
from ...models.entity import Entity
from ...models import db
from ..interfaces.entity_service import IEntityService


class EntityService(IEntityService):
    def __init__(self, logger):
        self.logger = logger

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
            new_entity = Entity(**entity.__dict__)
        except Exception as error:
            self.logger.error(str(error))
            raise error

        db.session.add(new_entity)
        # remember to commit to actually persist into the database
        db.session.commit()

        return new_entity.to_dict()

    def update_entity(self, id, entity):
        Entity.query.filter_by(id=id).update(entity.__dict__)
        updated_entity = Entity.query.get(id)
        db.session.commit()

        if updated_entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")
        return updated_entity.to_dict()

    def delete_entity(self, id):
        deleted = Entity.query.filter_by(id=id).delete()
        db.session.commit()

        # deleted is the number of rows deleted
        if deleted == 1:
            return id

        self.logger.error("Invalid id")
        raise Exception("Invalid id")

# } postgresql
# mongodb {
from ...models.entity import Entity
from ..interfaces.entity_service import IEntityService


class EntityService(IEntityService):
    def __init__(self, logger):
        self.logger = logger

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
            new_entity = Entity(**entity.__dict__)
            new_entity.save()
        except Exception as error:
            self.logger.error(str(error))
            raise error

        return new_entity.to_serializable_dict()

    def update_entity(self, id, entity):
        updated_entity = Entity.objects(id=id).modify(new=True, **entity.__dict__)

        if updated_entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")

        return updated_entity.to_serializable_dict()

    def delete_entity(self, id):
        try:
            deleted = Entity.objects(id=id).modify(remove=True)
            return id
        except Exception as error:
            self.logger.error(str(error))
            raise error

# } mongodb
# from ...models.entity import Entity
# from ...models import db
from ...models.entity_mongo import Entity
from ..interfaces.entity_service import IEntityService


class EntityService(IEntityService):
    def __init__(self, logger):
        self.logger = logger

    def get_entities(self):
        entities = []

        for result in Entity.objects:
            result_dict = result.to_dict()
            entities.append(result_dict)

        return entities

    def get_entity(self, id):
        entity = Entity.objects.get(id=id)

        if entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")

        return entity.to_dict()

    def create_entity(self, entity):
        try:
            new_entity = Entity(**entity)
            new_entity.save()
        except Exception as error:
            self.logger.error(str(error))
            raise error

        return new_entity.to_dict()

    def update_entity(self, id, entity):
        updated_entity = Entity.objects.get(id=id)

        if updated_entity is None:
            self.logger.error("Invalid id")
            raise Exception("Invalid id")
            
        updated_entity.update(**entity)
        updated_entity = Entity.objects.get(id=id)

        return updated_entity.to_dict()

    def delete_entity(self, id):
        try:
            deleted = Entity.objects.get(id=id)
            deleted.delete()
            return id
        except Exception as error:
            self.logger.error(str(error))
            raise error

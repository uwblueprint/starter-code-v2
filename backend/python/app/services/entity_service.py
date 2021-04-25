from ..models.entity import Entity
from ..models import db


def get_entities():
    # Entity is a SQLAlchemy model, we can use convenient methods provided
    # by SQLAlchemy like query.all() to query the data
    return [result.to_dict() for result in Entity.query.all()]


def get_entity(id):
    # get queries by the primary key, which is id for the Entity table
    entity = Entity.query.get(id)
    if entity is None:
        raise ValueError
    return entity.to_dict()


def create_entity(entity):
    new_entity = Entity(**entity)
    db.session.add(new_entity)
    # remember to commit to actually persist into the database
    db.session.commit()

    return new_entity.to_dict()


def update_entity(id, entity):
    Entity.query.filter_by(id=id).update(entity)
    updated_entity = Entity.query.get(id)
    db.session.commit()

    if updated_entity is None:
        raise ValueError
    return updated_entity.to_dict()


def delete_entity(id):
    deleted = Entity.query.filter_by(id=id).delete()
    db.session.commit()

    # deleted is the number of rows deleted
    if deleted == 1:
        return id

    raise ValueError

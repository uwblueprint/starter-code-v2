# postgresql {
from sqlalchemy import inspect
from sqlalchemy.orm.properties import ColumnProperty

from . import db
from .enum import enum

# common columns and methods across multiple data models can be added via a Mixin class:
# https://docs.sqlalchemy.org/en/13/orm/extensions/declarative/mixins.html

# see examples of Mixins in current and past Blueprint projects:
# https://github.com/uwblueprint/dancefest-web/blob/master/db/models.py#L10-L70
# https://github.com/uwblueprint/plasta/blob/master/backend/app/models/mixins.py#L10-L95


class SimpleEntity(db.Model):
    # define the simple entities table

    __tablename__ = "simple_entities"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    string_field = db.Column(db.String, nullable=False)
    int_field = db.Column(db.Integer, nullable=False)
    enum_field = db.Column(enum, nullable=False)
    string_array_field = db.Column(db.ARRAY(db.String), nullable=False)
    bool_field = db.Column(db.Boolean, nullable=False)

    # must define how to convert to a dict so that SimpleEntity can eventually be serialized into JSON
    # this would be a good method to include in a base Mixin
    def to_dict(self, include_relationships=False):
        cls = type(self)
        # mapper allows us to grab the columns of a Model
        mapper = inspect(cls)
        formatted = {}
        for column in mapper.attrs:
            field = column.key
            attr = getattr(self, field)
            # if it's a regular column, extract the value
            if isinstance(column, ColumnProperty):
                formatted[field] = attr
            # otherwise, it's a relationship field
            # (currently not applicable, but may be useful for entity groups)
            elif include_relationships:
                # recursively format the relationship
                # don't format the relationship's relationships
                formatted[field] = [obj.to_dict() for obj in attr]
        return formatted

# } postgresql
# mongodb {
from mongoengine import BooleanField, Document, IntField, ListField, StringField


class SimpleEntity(Document):
    string_field = StringField(required=True)
    int_field = IntField(required=True)
    enum_field = StringField(
        max_length=200, required=True, choices=["A", "B", "C", "D"]
    )
    string_array_field = ListField(StringField())
    bool_field = BooleanField()

    def to_serializable_dict(self):
        entity_dict = self.to_mongo().to_dict()
        id = entity_dict.pop("_id", None)
        entity_dict["id"] = str(id)
        return entity_dict

    meta = {"collection": "simple_entities"}

# } mongodb

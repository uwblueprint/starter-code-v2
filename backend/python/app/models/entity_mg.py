from mongoengine import *
from .enum import enum


class Entity(Document):
    string_field = StringField(max_length=200, required=True)
    int_field = IntField(required=True)
    enum_field = StringField(max_length=200, required=True, choices=["A", "B", "C", "D"])
    string_array_field = ListField(StringField(max_length=200))
    bool_field = BooleanField()

    def to_serializable_dict(self):
        entity_dict = self.to_mongo().to_dict()
        id = entity_dict.pop("_id", None)
        entity_dict["id"] = str(id)
        return entity_dict

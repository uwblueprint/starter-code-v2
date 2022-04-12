from . import db

enum = db.Enum("A", "B", "C", "D", name="enum")
simple_entity_enum = db.Enum("A", "B", "C", "D", name="simple_entity_enum")

from mongoengine import Document, StringField


class User(Document):
    first_name = StringField(required=True)
    last_name = StringField(required=True)
    auth_id = StringField(required=True)
    role = StringField(choices=["User", "Admin"], required=True)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable

        ObjectId must be converted to a string.
        """
        user_dict = self.to_mongo().to_dict()
        id = user_dict.pop("_id", None)
        user_dict["id"] = str(id)
        return user_dict

    meta = {"collection": "users"}

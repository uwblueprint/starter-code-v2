allowable_content_types = [
    "text/plain",
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/gif"
]

class EntityDTO(object):
    def __init__(self, **kwargs):
        self.string_field = kwargs.get("string_field")
        self.int_field = kwargs.get("int_field")
        self.string_array_field = kwargs.get("string_array_field")
        self.enum_field = (
            kwargs.get("enum_field").upper()
            if kwargs.get("enum_field") is not None
            else kwargs.get("enum_field")
        )
        self.bool_field = kwargs.get("bool_field")
        self.file_name = kwargs.get("file_name")
        self.file = kwargs.get("file")

    def validate(self):
        error_list = []
        if type(self.string_field) is not str:
            error_list.append("The string_field supplied is not a string.")
        if type(self.int_field) is not int:
            error_list.append("The int_field supplied is not an integer.")
        if type(self.string_array_field) is not list:
            error_list.append("The string_array_field supplied is not a list.")
        else:
            for item in self.string_array_field:
                if type(item) is not str:
                    error_list.append(
                        "The items supplied string_array_field are not a string."
                    )
        enum_values = {"A", "B", "C", "D"}
        if self.enum_field.upper() not in enum_values:
            error_list.append("The enum_field supplied is not an enum.")
        if type(self.bool_field) is not bool:
            error_list.append("The bool_field supplied is not a boolean.")
        if self.file:
            if self.file.content_type not in allowable_content_types:
                error_list.append("The {file_content_type} is not one of {allowed_types_str}".format(
                    file_content_type=self.file.content_type, allowed_types_str=",".join(allowable_content_types)
                ))

        return error_list

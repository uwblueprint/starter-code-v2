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

    def validate(self):
        error_list = []
        if not self.string_field or type(self.string_field) is not str:
            error_list.append("The string_field supplied is not a string.")
        if not self.int_field or type(self.int_field) is not int:
            error_list.append("The int_field supplied is not an integer.")
        if not self.string_array_field or type(self.string_array_field) is not list:
            error_list.append("The string_array_field supplied is not a list.")
        else:
            for item in self.string_array_field:
                if type(item) is not str:
                    error_list.append(
                        "The items supplied string_array_field are not a string."
                    )
        enum_values = {"A", "B", "C", "D"}
        if not self.enum_field or self.enum_field.upper() not in enum_values:
            error_list.append("The enum_field supplied is not an enum.")
        return error_list

class EntityRequestDTO(object):
    def __init__(self, file, **kwargs):
        self.string_field = kwargs.get("string_field")
        self.int_field = kwargs.get("int_field")
        self.string_array_field = kwargs.get("string_array_field")
        self.enum_field = (
            kwars.get("enum_field").upper()
            if kwargs.get("enum_field") is not None
            else kwargs.get("enum_field")
        )
        self.bool_field = kwargs.get("bool_field")
        self.file = file

    def validate(self):
        error_list = []
        if not self.string_field or type(self.string_field) is not str:
            error_list.append("The string_field supplied is not a string.")
        if not self.int_field or type(self.int_field) is not int:
            error_list.append("The int_field supplied is not an integer.")
        if not self.string_array_field or type(self.string_array_field) is not list:
            error_list.append("The string_array_field supplied is not a list.")
        else:
            for item in self.string_array_field:
                if type(item) is not str:
                    error_list.append(
                        "The items supplied string_array_field are not a string."
                    )
        enum_values = {"A", "B", "C", "D"}
        if not self.enum_field or self.enum_field.upper() not in enum_values:
            error_list.append("The enum_field supplied is not an enum.")
class EntityDTO(object):
    def __init__(
        self, string_field, int_field, string_array_field, enum_field, bool_field
    ):
        # apply some validations
        if not string_field:
            raise ValueError("Invalid string_field value, must not be empty")
        elif int_field is None:
            raise ValueError("Invalid int_field value, must not be empty")
        elif string_array_field is None:
            raise ValueError("Invalid string_array_field value, must not be empty")
        elif bool_field is None:
            raise ValueError("Invalid bool_field value, must not be empty")
        elif enum_field is not None:
            enum_values = {"A", "B", "C", "D"}
            if enum_field.upper() not in enum_values:
                raise ValueError("Invalid enum_field value, it must be A, B, C, or D")
        else:
            raise ValueError("Invalid enum_field value,  must not be none!")

        self.string_field = string_field
        self.int_field = int_field
        self.string_array_field = string_array_field
        self.enum_field = enum_field.upper() if enum_field is not None else enum_field
        self.bool_field = bool_field

    def validate(self):
        error_list = []
        if not self.string_field or type(self.string_field) is not str:
            error_list.append("The string_field supplied is not a string.")
        if not self.int_field or not type(self.string_field) is not int:
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

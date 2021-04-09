class EntityDTO(object):
    def __init__(self, string_field, int_field, string_array_field, enum_field, bool_field):
        # apply some validations
        if string_field is None:
            raise ValueError('Invalid string_field value, must not be empty')
        elif int_field is None:
            raise ValueError('Invalid int_field value, must not be empty')      
        elif string_array_field is None:
            raise ValueError('Invalid string_array_field value, must not be empty')
        elif bool_field is None:
            raise ValueError('Invalid bool_field value, must not be empty')
        elif enum_field is not None:
            enum_values  = {'A', 'B', 'C', 'D'}
            if enum_field.upper() not in enum_values:
                raise ValueError('Invalid enum_field value, it must be A, B, or C')
        else:
            raise ValueError('Invalid enum_field value,  must not be none!')

        self.string_field = string_field
        self.int_field = int_field
        self.string_array_field = string_array_field
        self.enum_field = enum_field.upper() if enum_field is not None else enum_field
        self.bool_field = bool_field

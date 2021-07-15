class CreateUserDTO:
    def __init__(self, **kwargs):
        self.first_name = kwargs.get("first_name")
        self.last_name = kwargs.get("last_name")
        self.email = kwargs.get("email")
        self.role = kwargs.get("role")
        self.password = kwargs.get("password")

    def validate(self):
        error_list = []
        if type(self.first_name) is not str:
            error_list.append("The first_name supplied is not a string.")
        if type(self.last_name) is not str:
            error_list.append("The last_name supplied is not a string.")
        if type(self.email) is not str:
            error_list.append("The email supplied is not a string.")
        if type(self.role) is not str:
            error_list.append("The role supplied is not a string.")
        if type(self.password) is not str:
            error_list.append("The password supplied is not a string.")
        return error_list

from logging import error


class CreateUserDTO:
    def __init__(
        self, **kwargs
    ):
        self.first_name = kwargs.get("first_name")
        self.last_name = kwargs.get("last_name")
        self.email = kwargs.get("email")
        self.role = kwargs.get("role")
        self.password = kwargs.get("password")

    def validate(self):
        error_list = []
        if not self.first_name or type(self.first_name) != str:
            error_list.append("There is an error with the first name in this request.")
        if not self.last_name or type(self.last_name) != str:
            error_list.append("There is an error with the last name in this request.")
        if not self.email or type(self.email) != str:
            error_list.append("There is an error with the email in this request.")
        if not self.role or type(self.role) != str:
            error_list.append("There is an error with the role in this request.")
        if not self.password or type(self.password) != str:
            error_list.append("There is an error with the password in this request.")
        return error_list

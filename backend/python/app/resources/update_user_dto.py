class UpdateUserDTO:
    def __init__(self, first_name=None, last_name=None, email=None, role=None):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.role = role

    def validate(self):
        error_list = []
        if not self.first_name or type(self.first_name) is not str:
            error_list.append("There is an error with the first name in this request.")
        if not self.last_name or type(self.last_name) is not str:
            error_list.append("There is an error with the last name in this request.")
        if not self.email or type(self.email) is not str:
            error_list.append("There is an error with the email in this request.")
        if not self.role or type(self.role) is not str:
            error_list.append("There is an error with the role in this request.")
        return error_list

class CreateUserDTO:
    def __init__(self, first_name, last_name, email, role, password):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.role = role
        self.password = password

    def validate():
        if self.first_name == null || type(self.first_name) != str:
            return False
        if self.last_name == null || type(self.last_name) != str:
            return False
        if self.email == null || type(self.email) != str:
            return False
        if self.role == null || type(self.role) != str:
            return False
        if self.password == null || type(self.password) != str:
            return False
        return True
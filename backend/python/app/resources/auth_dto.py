from .token import Token
from .user_dto import UserDTO


class AuthDTO(Token, UserDTO):
    def __init__(
        self, access_token, refresh_token, id, first_name, last_name, email, role
    ):
        Token.__init__(self, access_token, refresh_token)
        UserDTO.__init__(self, id, first_name, last_name, email, role)

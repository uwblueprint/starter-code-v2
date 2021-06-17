import pytest

from app import create_app
from app.models.user_mg import User

'''
Sample python test.
For more information on pytest, visit:
https://docs.pytest.org/en/6.2.x/reference.html
'''


TEST_USERS = [
    {
        "auth_id": "A",
        "first_name": "Jane",
        "last_name": "Doe",
        "role": "Admin",
    },
    {
        "auth_id": "B",
        "first_name": "Hello",
        "last_name": "World",
        "role": "User",
    }
]


class FirebaseUser:
    '''
    Mock returned firebase user
    '''

    def __init__(self):
        self.email = "test@test.com"


def get_expected_user(user):
    '''
    Remove auth_id field from user and sets email field.
    '''
    user["email"] = "test@test.com"
    user.pop("auth_id", None)
    return user


def insert_users():
    user_instances = [User(**data) for data in TEST_USERS]
    User.objects.insert(user_instances, load_bulk=False)


@pytest.fixture
def client(mocker):
    mocker.patch("app.services.implementations.auth_service.AuthService.is_authorized_by_role", return_value=True)
    mocker.patch("firebase_admin.auth.get_user", return_value=FirebaseUser())
    test_client = create_app("testing").test_client()
    insert_users()
    yield test_client


def test_get_users(client):
    res = client.get("/users")
    users_with_email = list(map(get_expected_user, TEST_USERS))
    for expected_user, actual_user in zip(users_with_email, res.json):
        for key in users_with_email[0].keys():
            assert expected_user[key] == actual_user[key]

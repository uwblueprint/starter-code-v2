import pytest

from app import create_app
from app.models.user import User

# postgresql {
from app.models import db
# } postgresql

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
    # mongodb {
    user_instances = [User(**data) for data in TEST_USERS]
    User.objects.insert(user_instances, load_bulk=False)
    # } mongodb
    # postgresql {
    user_instances = [User(**data) for data in TEST_USERS]
    db.session.bulk_save_objects(user_instances)
    db.session.commit()
    # } postgresql


@pytest.fixture(scope="module", autouse=True)
def setup(module_mocker):
    module_mocker.patch("app.services.implementations.auth_service.AuthService.is_authorized_by_role", return_value=True)
    module_mocker.patch("firebase_admin.auth.get_user", return_value=FirebaseUser())


def test_get_users(client):
    insert_users()
    res = client.get("/users")
    users_with_email = list(map(get_expected_user, TEST_USERS))
    for expected_user, actual_user in zip(users_with_email, res.json):
        for key in users_with_email[0].keys():
            assert expected_user[key] == actual_user[key]

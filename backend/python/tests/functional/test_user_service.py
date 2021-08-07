from flask import current_app
import pytest

from app.models.user_mg import User
from app.models.user_pg import User as UserPg
from app.services.implementations.user_service_mg import UserService as UserServiceMg
from app.services.implementations.user_service_pg import UserService as UserServicePg

from app.models import db

'''
Sample python test.
For more information on pytest, visit:
https://docs.pytest.org/en/6.2.x/reference.html
'''


@pytest.fixture(scope="module", autouse=True)
def setup(module_mocker):
    module_mocker.patch("app.services.implementations.auth_service.AuthService.is_authorized_by_role", return_value=True)
    module_mocker.patch("firebase_admin.auth.get_user", return_value=FirebaseUser())


@pytest.fixture
def mg_user_service():
    user_service = UserServiceMg(current_app.logger)
    yield user_service
    User.objects.delete()


@pytest.fixture
def pg_user_service():
    user_service = UserServicePg(current_app.logger)
    yield user_service
    UserPg.query.delete()


TEST_USERS = (
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
)


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
    expected_user = user.copy()
    expected_user["email"] = "test@test.com"
    expected_user.pop("auth_id", None)
    return expected_user


def insert_users_mg():
    user_instances = [User(**data) for data in TEST_USERS]
    User.objects.insert(user_instances, load_bulk=False)


def insert_users_pg():
    user_instances = [UserPg(**data) for data in TEST_USERS]
    db.session.bulk_save_objects(user_instances)
    db.session.commit()


def assert_returned_users(users, expected):
    for expected_user, actual_user in zip(expected, users):
        for key in expected[0].keys():
            assert expected_user[key] == actual_user[key]


def test_get_users(mg_user_service, pg_user_service):
    insert_users_mg()
    res = mg_user_service.get_users()
    users = list(map(lambda user: user.__dict__, res))
    users_with_email = list(map(get_expected_user, TEST_USERS))
    assert_returned_users(users, users_with_email)

    # test pg implementation
    insert_users_pg()
    res = pg_user_service.get_users()
    users = list(map(lambda user: user.__dict__, res))
    assert_returned_users(users, users_with_email)

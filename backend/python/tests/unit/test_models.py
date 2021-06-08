from app.models.user_mg import User


def test_create_user():
    user = {
        "first_name": "Jane",
        "last_name": "Doe",
        "auth_id": "abc",
        "role": "Admin",
    }

    user = User(**user)
    assert user.first_name == "Jane"
    assert user.last_name == "Doe"
    assert user.auth_id == "abc"
    assert user.role == "Admin"

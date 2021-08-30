from app.models.user import User

# postgresql {
from app.models import db
# } postgresql

"""
Sample python test.
For more information on pytest, visit:
https://docs.pytest.org/en/6.2.x/reference.html
"""


def test_create_user():
    user = {
        "first_name": "Jane",
        "last_name": "Doe",
        "auth_id": "abc",
        "role": "Admin",
    }

    user = User(**user)
    # postgresql {
    db.session.add(user)
    db.session.commit()
    # } postgresql
    assert user.first_name == "Jane"
    assert user.last_name == "Doe"
    assert user.auth_id == "abc"
    assert user.role == "Admin"

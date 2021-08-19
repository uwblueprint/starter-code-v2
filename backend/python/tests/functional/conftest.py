import pytest

from app import create_app


@pytest.fixture(scope="session", autouse=True)
def client():
    test_client = create_app("testing").test_client()
    yield test_client

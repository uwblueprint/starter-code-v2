"""
Test Cases for generate_csv

Current Issues:
1. Note that unwind only unwinds at the current level
2. List of dictionaries must be of the same type
"""

person = [
    {
        "name": "Person1",
        "age": 20,
        "pets": [
            {"name": "Beans", "type": "Cat"},
            {"name": "Spot", "type": "Dog"},
        ],
    },
    {
        "name": "Person2",
        "age": 25,
        "pets": [{"name": "Splash", "type": "Fish"}],
    },
]

person2 = [
    {
        "name": "Person1",
        "age": 20,
        "pets": [
            {"name": "Beans", "type": "Cat"},
            {"name": "Spot", "type": "Dog"},
        ],
    },
]

person3 = [
    {
        "name": "Person1",
        "age": 20,
        "pets": [
            {"name": "Beans", "type": "Cat"},
            {"name": "Spot", "type": "Dog"},
        ],
        "num_pets": 5,
    },
]

person4 = [
    {
        "name": "Person1",
        "age": 20,
        "pet": {"name": "Beans", "type": "Cat"},
    },
]


def transform_person(person):
    transformed = person.copy()
    transformed["num_pets"] = len(transformed["pets"])
    return transformed


options = {
    "header": True,
    "transform": transform_person,
    "flatten_lists": False,
    "flatten_objects": False,
}

unwind_options = {
    "header": True,
    "unwind": "pets",
    "flatten_lists": False,
    "flatten_objects": False,
}


flatten_list_options = {
    "header": True,
    "flatten_lists": True,
    "flatten_objects": False,
}


flatten_objects_options = {
    "header": True,
    "flatten_lists": False,
    "flatten_objects": True,
}


flatten_both_options = {
    "header": True,
    "flatten_lists": True,
    "flatten_objects": True,
}


no_header_options = {
    "header": False,
    "flatten_lists": False,
    "flatten_objects": False,
}

from app.utilities.csv_utils import generate_csv_from_list


def test_basic():
    result = generate_csv_from_list(person)
    assert (
        result
        == "Person1,20,\"[{'name': 'Beans', 'type': 'Cat'}, {'name': 'Spot', 'type': 'Dog'}]\"\r\nPerson2,25,\"[{'name': 'Splash', 'type': 'Fish'}]\"\r\n"
    )


def test_transform():
    result = generate_csv_from_list(person2, **options)
    assert (
        result
        == "name,age,pets,num_pets\r\nPerson1,20,\"[{'name': 'Beans', 'type': 'Cat'}, {'name': 'Spot', 'type': 'Dog'}]\",2\r\n"
    )


def test_nested():
    result = generate_csv_from_list(person4, **no_header_options)
    assert result == "Person1,20,\"{'name': 'Beans', 'type': 'Cat'}\"\r\n"


def test_flatten_objects():
    result = generate_csv_from_list(person4, **flatten_objects_options)
    assert result == "name,age,pet.name,pet.type\r\nPerson1,20,Beans,Cat\r\n"


def test_flatten_lists():
    result = generate_csv_from_list(person2, **flatten_list_options)
    assert (
        result
        == "name,age,pets.0,pets.1\r\nPerson1,20,\"{'name': 'Beans', 'type': 'Cat'}\",\"{'name': 'Spot', 'type': 'Dog'}\"\r\n"
    )


def test_flatten_both():
    result = generate_csv_from_list(person2, **flatten_both_options)
    assert (
        result
        == "name,age,pets.0.name,pets.0.type,pets.1.name,pets.1.type\r\nPerson1,20,Beans,Cat,Spot,Dog\r\n"
    )


def test_unwind():
    result = generate_csv_from_list(person2, **unwind_options)
    assert (
        result
        == "name,age,pets\r\nPerson1,20,\"{'name': 'Beans', 'type': 'Cat'}\"\r\nPerson1,20,\"{'name': 'Spot', 'type': 'Dog'}\"\r\n"
    )

""" 
Generates a csv string given a list of dictionaries
Some Notes: 
1. Unwind only unwinds a single level (i.e a list)
2. CSV requires all dictionaries in the list are of the same type
"""

import csv
import io


def flatten_dicts(dictionary, parent_key="", sep="."):
    """
    Flatten a dictionary of dictionaries into a single dictionary

    Example:
    {'a': {'b': 1, 'c': 2}, 'd': {'e': 3, 'f': 4}}
    flatten_dicts(dictionary, parent_key="", sep=".")
    {'a.b': 1, 'a.c': 2, 'd.e': 3, 'd.f': 4}

    :param dictionary: dictionary to flatten
    :param parent_key: key to use as the parent key for the new dictionary
    :param sep: separator to use when combining keys
    :return: flattened dictionary
    :rtype: dict
    """
    items = []
    for key, val in dictionary.items():
        new_key = parent_key + sep + str(key) if parent_key else str(key)
        if isinstance(val, dict):
            items.extend(flatten_dicts(val, new_key, sep=sep).items())

        else:
            items.append((new_key, val))
    return dict(items)


def flatten_lists_in_dict(dictionary, sep="."):
    """
    Flatten a dictionary of lists into a single dictionary

    Example:
    {'a': [1, 2, 3], 'b': [4, 5, 6]}
    flatten_lists_in_dict(dictionary, sep=".")
    {'a.1': 1, 'a.2': 2, 'a.3': 3, 'b.1': 4, 'b.2': 5, 'b.3': 6}

    :param dictionary: dictionary to flatten
    :param sep: separator to use when combining keys
    :return: flattened dictionary
    :rtype: dict
    """
    items = []
    lsts = 0
    for key, val in dictionary.items():
        if isinstance(val, list):
            for i in range(len(val)):
                lsts += 1
                new_key = key + sep + str(i)
                items.append((new_key, val[i]))
        else:
            items.append((key, val))

    return dict(items) if lsts == 0 else flatten_lists_in_dict(dict(items), sep=sep)


def transform_function(dict_list, transform):
    """
    Applies a function to each dictionary in a list of dictionaries

    Example:
    [{'a': 1}, {'a': 2}, {'a': 3}]
    transform_function(dict_list, lambda x: x + 1)
    [{'a': 2}, {'a': 3}, {'a': 4}]

    :param dict_list: list of dictionaries
    :param transform: transformation function
    :return: transformed dictionary list
    :rtype: list of dict
    """
    new_dict_list = [transform(dictionary) for dictionary in dict_list]
    return new_dict_list


def unwind_field(list_of_dict, field):
    """
    Unwinds lists inside dicts into multiple dictionaries, returning a new list at the end

    Example:
    [{'a': [1, 2, 3]}, {'a': [4, 5, 6]}]
    unwind_field(list_of_dict, 'a')
    [{'a': 1}, {'a': 2}, {'a': 3}, {'a': 4}, {'a': 5}, {'a': 6}]

    :param list_of_dict: list of dictionaries
    :param field: field to unwind
    :return: list of dictionaries
    :rtype: list of dict
    """
    new_list = []
    for dictionary in list_of_dict:
        found = False
        for key, value in dictionary.items():
            if key == field and isinstance(value, list):
                found = True
                for item in value:
                    temp_dict = dictionary.copy()
                    temp_dict[key] = item
                    new_list.append(temp_dict)

        if not found:
            new_list.append(dictionary)
    return new_list


def generate_csv_from_list(dict_list, **kwargs):
    """
    Given a list of dictionaries, generate a csv string without spaces

    :param dict_list: list of dictionaries
    :param options: options to specify csv format
    :return: csv string
    :rtype: str
    """
    if kwargs.get("transform", None):
        dict_list = transform_function(dict_list, kwargs["transform"])

    if kwargs.get("flatten_lists", None) and kwargs.get("flatten_objects", None):
        dict_list = [flatten_lists_in_dict(flatten_dicts(dict)) for dict in dict_list]

    if kwargs.get("flatten_objects", None):
        dict_list = [flatten_dicts(dict) for dict in dict_list]

    if kwargs.get("unwind", None):
        dict_list = unwind_field(dict_list, kwargs["unwind"])

    if kwargs.get("flatten_lists", None):
        dict_list = [flatten_lists_in_dict(dict) for dict in dict_list]

    output = io.StringIO()
    field_names = (
        {key: None for d in dict_list for key in d.keys()}.keys()
        if not kwargs.get("field", None)
        else kwargs["field"]
    )
    writer = csv.DictWriter(output, fieldnames=field_names)

    if kwargs.get("header", None):
        writer.writeheader()

    writer.writerows(dict_list)

    return output.getvalue()

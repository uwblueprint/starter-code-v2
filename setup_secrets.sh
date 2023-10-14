#!/bin/bash
OUTPUT_PATH=".env"

function usage() {
    echo "Invalid parameter, check guide from https://www.notion.so/uwblueprintexecs/Secret-Management-2d5b59ef0987415e93ec951ce05bf03e#1240f493d1f3495e836c07b3dfd64f28"
}

function check_parameters() {
    while [[ $# -gt 0 ]]; do
        key="$1"

        case $key in

        --output_path)
        OUTPUT_PATH=$2
        shift
        shift
        ;;
        *)
            usage
            ;;
        esac
    done
}

function check_package() {
    local package="$1"
    which "${package}" &> /dev/null
    if [ $? -ne 0 ]
    then
        echo "${package} not found in the local machine, 
        check the documentation for installation  <link of Maisha documnetation>"
        exit 1
    fi
}

function check_packages() {
    check_package "vlt"
    check_package "jq"
    local os_type=$(uname)
    if [[ "$os_type" == "MINGW"* || "$os_type" == "MSYS"* || "$os_type" == "CYGWIN"* ]]; 
    then
        echo "You are currently on a windows machine, check installation of xdg-utils..."
        check_package "xdg-utils"
    fi
}

function get_secrets() {
    echo "usage: check guide from https://www.notion.so/uwblueprintexecs/Secret-Management-2d5b59ef0987415e93ec951ce05bf03e#1240f493d1f3495e836c07b3dfd64f28"
    check_packages
    check_parameters "$@"
    local login_message="$(vlt login)"
    if [[ "$login_message" != "Successfully logged in" ]]; then
        echo "Currently not loggin, login first to the vault secret to set up .env file" 
        exit 1
    fi
    local all_secrets_json=$(vlt secrets -format json)
    local all_secrets_names="$(jq -r '.[]."name"' <<< ${all_secrets_json})"

    if [ -e "$OUTPUT_PATH" ]; then
        echo "Provided file already exist: New Secrets will be append at the end of $OUTPUT_PATH"
    else
        echo "New file $OUTPUT_PATH will be created to store secrets"
    fi

    for secret_name in $(echo $all_secrets_names);
    do
        local secret_val=$(vlt secrets get -plaintext $secret_name)
        local upper_secret_name=$(echo $secret_name | tr '[:lower:]' '[:upper:]')
        local new_env_line="${upper_secret_name}=${secret_val}"
        echo $new_env_line >> $OUTPUT_PATH
    done
    echo "Successfully adding all variables to ${OUTPUT_PATH}"
}

get_secrets "$@"


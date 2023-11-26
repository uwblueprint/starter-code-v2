#!/bin/bash
OUTPUT_PATH=".env"

function usage() {
    echo "Invalid parameter, check guide from <link of Maisha documnetation>"
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
    check_packages
    check_parameters "$@"
    local login_message="$(vlt login)"
    echo $login_message
    if [[ "$login_message" != "Successfully logged in" ]]; then
        echo "Currently not loggin, login first to the vault secret to set up .env file" 
        exit 1
    fi
    local all_secrets_json=$(vlt secrets -format json)
    local all_secrets_names="$(jq -r '.[]."name"' <<< ${all_secrets_json})"
    for secret_name in $(echo $all_secrets_names);
    do
        local secret_val=$(vlt secrets get -plaintext $secret_name)
        local upper_secret_name=$(echo $secret_name | tr '[:lower:]' '[:upper:]')
        local new_env_line="${upper_secret_name}=${secret_val}"
        echo "Adding ${upper_secret_name} to ${OUTPUT_PATH}"
        echo $new_env_line >> $OUTPUT_PATH
    done
    echo "Successfully adding all variables to ${OUTPUT_PATH}"
}

get_secrets "$@"


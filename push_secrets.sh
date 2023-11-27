#!/bin/bash

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <path_to_env_file> [organization name or ID] [project name or ID]"
  exit 1
fi

ENV_FILE_PATH="$1"
ORGANIZATION="${2:-}"
PROJECT="${3:-}"

VLT_ARGS=""
[ -n "$ORGANIZATION" ] && VLT_ARGS="--organization=$ORGANIZATION"
[ -n "$PROJECT" ] && VLT_ARGS="$VLT_ARGS --project=$PROJECT"

# check if env file path exists
if [ ! -f "$ENV_FILE_PATH" ]; then
  echo "Error: $ENV_FILE_PATH not found"
  exit 1
fi

# read .env file and write to vault secrets
while IFS="=" read -r key value; do
  # skip comments or empty lines
  [[ $key == \#* ]] && continue
  [[ -z $key ]] && continue

  vlt secrets create $VLT_ARGS $key="$value"
done < "$ENV_FILE_PATH"

echo "Migration to Vault complete."

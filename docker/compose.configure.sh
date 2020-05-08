#! /bin/sh

set -euox

CONFIGURATION_PATH=${1:-"../primero-configuration"}
CONFIGURATION_FILE=${2:-"load_configuration.rb"}

./compose.prod.sh run \
    -v "${CONFIGURATION_PATH}:/primero-configuration" \
    -e PRIMERO_CONFIGURATION_FILE="/primero-configuration/${CONFIGURATION_FILE}" \
    -e PRIMERO_RUN_CONFIG_SCRIPTS=true \
    application primero-bootstrap

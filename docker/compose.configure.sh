#! /bin/bash
# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

set -eux

CONFIGURATION_MOUNT=""
ENV_PRIMERO_CONFIGURATION_FILE=""

if [[ "$#" != 0 ]]
then
  CONFIGURATION_MOUNT="-v ${1}:/primero-configuration"
  if [[ -d "${1}/${2}" ]] ; then
    PRIMERO_CONFIGURATION_FILE="${2}/load_configuration.rb"
  else
    PRIMERO_CONFIGURATION_FILE=${2:-"load_configuration.rb"}
  fi
  ENV_PRIMERO_CONFIGURATION_FILE="-e PRIMERO_CONFIGURATION_FILE=/primero-configuration/${PRIMERO_CONFIGURATION_FILE}"
fi

./compose.prod.sh --profile configure -f docker-compose.configure.yml run --rm ${CONFIGURATION_MOUNT} ${ENV_PRIMERO_CONFIGURATION_FILE} configure primero-bootstrap

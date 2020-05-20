#! /bin/sh

set -eux

CONFIGURATION_MOUNT=""
ENV_PRIMERO_CONFIGURATION_FILE=""

if [[  "$#" != 0 ]]
then
  CONFIGURATION_MOUNT="-v ${1}:/primero-configuration"
  ENV_PRIMERO_CONFIGURATION_FILE="-e PRIMERO_CONFIGURATION_FILE=/primero-configuration/${2:-"load_configuration.rb"}"
fi

./compose.prod.sh run $CONFIGURATION_MOUNT $ENV_PRIMERO_CONFIGURATION_FILE application primero-configure

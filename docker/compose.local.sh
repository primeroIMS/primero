#! /bin/sh
# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

: "${SOLR_ENABLED:=false}"

set -euox

DOCKER_COMPOSE_COMMAND="./compose.sh -f docker-compose.db.yml -f docker-compose.local.yml"

# if SOLR_ENABLED is true add compose.solr.local file
if [[ "${SOLR_ENABLED}" == 'true' ]] ; then
  DOCKER_COMPOSE_COMMAND="${DOCKER_COMPOSE_COMMAND} -f docker-compose.solr.local.yml"
fi

exec ${DOCKER_COMPOSE_COMMAND} "${@}"

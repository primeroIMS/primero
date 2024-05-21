#! /bin/bash
# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

: "${PRIMERO_DEPLOY_NODB:=false}"
: "${SOLR_ENABLED:=false}"

set -euox

DOCKER_COMPOSE_COMMAND="./compose.sh -f docker-compose.prod.yml"

# if PRIMERO_DEPLOY_NODB is false add compose.db file
if [[ "${PRIMERO_DEPLOY_NODB}" == 'false' ]] ; then
  DOCKER_COMPOSE_COMMAND="${DOCKER_COMPOSE_COMMAND} -f docker-compose.db.yml"
fi

# if SOLR_ENABLED is true add compose.solr file
if [[ "${SOLR_ENABLED}" == 'true' ]] ; then
  DOCKER_COMPOSE_COMMAND="${DOCKER_COMPOSE_COMMAND} -f docker-compose.solr.yml"
fi

exec ${DOCKER_COMPOSE_COMMAND} "${@}"

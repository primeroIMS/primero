#! /bin/sh
# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

: "${SOLR_ENABLED:=false}"

SOLR_PROFILE=""

set -euox

if [[ "${SOLR_ENABLED}" == 'true' ]] ; then
  SOLR_PROFILE="--profile solr"
fi

exec "./compose.sh" --profile db ${SOLR_PROFILE} -f "docker-compose.db.yml" -f "docker-compose.local.yml" "${@}"

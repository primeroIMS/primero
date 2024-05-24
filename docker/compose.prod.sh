#! /bin/bash
# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

: "${PRIMERO_DEPLOY_NODB:=false}"

set -euox

if [[ "${PRIMERO_DEPLOY_NODB}" == 'false' ]] ; then
  exec "./compose.sh" -f "docker-compose.prod.yml" -f "docker-compose.db.yml" "${@}"
else
  exec "./compose.sh" -f "docker-compose.prod.yml" "${@}"
fi

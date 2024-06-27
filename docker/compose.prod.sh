#! /bin/bash
# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

: "${PRIMERO_DEPLOY_NODB:=false}"
DB_PROFILE=""
set -euox

if [[ "${PRIMERO_DEPLOY_NODB}" == 'false' ]] ; then
  DB_PROFILE="--profile db"
fi

exec "./compose.sh" ${DB_PROFILE} -f "docker-compose.prod.yml" -f "docker-compose.db.yml" "${@}"
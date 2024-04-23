#! /bin/sh
# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

: "${PROJECT_NAME:=primero}"

set -euox
exec docker compose -p "${PROJECT_NAME}" --project-directory "../" -f "docker-compose.yml" "${@}"

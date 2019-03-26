#! /bin/sh

: "${PROJECT_NAME:=primero}"

set -ex

exec docker-compose -p "${PROJECT_NAME}" -f "docker-compose.yml" "${@}"

#! /bin/sh

: "${PROJECT_NAME:=primero}"

set -euox
exec docker-compose -p "${PROJECT_NAME}" "${@}"

#! /bin/sh

: "${PROJECT_NAME:=primero}"

set -euox
exec /opt/docker/bin/docker-compose -p "${PROJECT_NAME}" --project-directory "../" -f "docker-compose.yml" "${@}"

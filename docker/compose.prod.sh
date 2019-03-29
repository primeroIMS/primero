#! /bin/sh

set -ex

exec "./compose.sh" -f "docker-compose.prod.yml" "${@}"

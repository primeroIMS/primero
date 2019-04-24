#! /bin/sh

set -euox
exec "./compose.sh" -f "docker-compose.prod.yml" "${@}"

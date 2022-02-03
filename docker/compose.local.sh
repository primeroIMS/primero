#! /bin/sh

set -euox
exec "./compose.sh" -f "docker-compose.db.yml" -f "docker-compose.local.yml" "${@}"

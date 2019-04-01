#! /bin/sh

set -ex

exec "./compose.sh" -f "docker-compose.le-agent.yml" "${@}"

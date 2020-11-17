#! /bin/sh

set -euox
exec ./compose.sh -f docker-compose.yml -f docker-compose.local.yml "${@}"

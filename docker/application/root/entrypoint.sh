#!/bin/bash

set -ex
printf "Starting Primero application container\\n"
printf "Performing configuration substitution"


# Search each of these directories for .template files and perform substitution
/sub.sh "/srv/primero/application/config"

exec "$@"

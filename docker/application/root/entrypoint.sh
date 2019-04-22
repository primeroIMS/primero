#!/bin/bash

set -ex
printf "Starting Primero application container\\n"
printf "Performing configuration substitution"


# Search each of these directories for .template files and perform substitution
/sub.sh "/srv/primero/application/config"

# Check if the postgres credentials are defined
if [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_USERNAME" ];
then
  printf "Postgres credentials not defined! Please check configuration.\\n"
  exit 1
fi

exec "$@"

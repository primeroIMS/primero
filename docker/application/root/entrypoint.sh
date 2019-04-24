#!/bin/bash

set -euox pipefail
printf "Starting Primero application container\\n"
printf "Performing configuration substitution"


# Search each of these directories for .template files and perform substitution
/sub.sh "/srv/primero/application/config"

set +u
# Check if the postgres credentials are defined. If they aren't then complain.
if [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_USERNAME" ];
then
  printf "Postgres credentials not defined! Please check configuration.\\n"
fi
set -u

# if primero exists then prefer the rails / rake binaries from the repo
if [ -d "$APP_ROOT/bin" ];
then
  printf 'Adding primero/bin to path'
  export PATH="$APP_ROOT/bin:$PATH"
fi

# Create the logging directory and file
mkdir -p "${RAILS_LOG_PATH}/${RAILS_ENV}"
touch "${RAILS_LOG_PATH}/${RAILS_ENV}.log"

# If you pass "primero" as the arg, then start primero and don't eval anything
if [ "$1" == "primero" ] && [[ "$#" -eq 1 ]];
then
  bundle exec rails db:drop
  bundle exec rails db:create
  bundle exec rails db:migrate
  bundle exec rails db:seed
else
  exec "$@"
fi


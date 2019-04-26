#!/bin/bash

set -euox pipefail
printf "Starting Primero application container\\n"
printf "Performing configuration substitution"


# Search each of these directories for .template files and perform substitution
/sub.sh "/srv/primero/application/config"

set +u
# Check if the postgres credentials are defined. If they aren't then complain.
if [ -z "$POSTGRES_PASSWORD" ] || [ -z "$POSTGRES_USER" ];
then
  printf "Postgres credentials not defined! Please check configuration.\\n"
fi
set -u

# if primero exists then prefer the rails / rails binaries from the repo
if [ -d "$APP_ROOT/bin" ];
then
  printf "Adding primero/bin to path\\n"
  export PATH="$APP_ROOT/bin:$PATH"
fi

# Create the logging directory and file
mkdir -p "${RAILS_LOG_PATH}/${RAILS_ENV}"
touch "${RAILS_LOG_PATH}/${RAILS_ENV}.log"

mkdir -p "${APP_ROOT}/node_modules"

# If you pass "primero" as the arg, then start primero and don't eval anything
if [ "$1" == "primero" ] && [[ "$#" -eq 1 ]];
then
  # shellcheck disable=SC2034
  DISABLE_DATABASE_ENVIRONMENT_CHECK=1 rails db:drop
  rails db:create
  rails db:migrate
  rails db:seed
  # not working
  # rails sunspot:reindex
  rails tmp:cache:clear
  rails assets:precompile
  rails s
else
  exec "$@"
fi


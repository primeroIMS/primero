#!/bin/bash

set -euox pipefail
printf "Starting Primero application container\\n"
printf "Performing configuration substitution"


# Search each of these directories for .template files and perform substitution
/sub.sh "/srv/primero/application/config"

set +u
# Check if the postgres credentials are defined. If they aren't then complain.
if [ -z "$POSTGRES_PASSWORD"  ||  -z "$POSTGRES_USER" ];
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
# Create the folder for the node modules that will be installed during asset
# compile
mkdir -p "${APP_ROOT}/node_modules"

# check if the bootstrap file has been created and set the env variable
# appropriated. we will rely on the env variable over the file because it is
# less places to change the path.
if [ -f "/.bootstrap-completed" ];
then
  printf "Bootstrap completion detected.\\n"
  export PRIM_BOOTSTRAP_COMPLETED=true
else
  export PRIM_BOOTSTRAP_COMPLETED=""
  printf "Bootstrap not detecting. Preparing to bootstrap.\\n"
fi

# if you pass bootstrap or the bootstrap hasn't been completed then do it.
if [[ ( "$1" == "bootstrap" && "$#" -eq 1 ) || ! "$PRIM_BOOTSTRAP_COMPLETED" ]];
then
  # shellcheck disable=SC2034
  DISABLE_DATABASE_ENVIRONMENT_CHECK=1 rails db:drop
  bin/rails db:create
  bin/rails db:migrate
  bin/rails db:seed
  # rails sunspot:reindex # not working
  # TODO: move tmp cache clear and assets precompile to build time
  bin/rails tmp:cache:clear
  bin/rails assets:precompile
  bin/rails s # TODO: puma -c <path to config>
  touch /.bootstrap-completed
# if we explicitly say start or no argument has been provided and bootstrap has
# already occured then run rails s
elif [ "$1" == "start" ] || [ "$#" -eq 0 ];
then
  bin/rails s
# otherwise just run whatever has been passed by cmd
else
  exec "$@"
fi


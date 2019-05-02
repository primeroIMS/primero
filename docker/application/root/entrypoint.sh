#!/bin/bash

set -euox pipefail

prim_export_local_binaries() {
  # if primero exists then prefer the rails / rails binaries from the repo
  if [ -d "$APP_ROOT/bin" ];
  then
    printf "Adding primero/bin to path\\n"
    export PATH="$APP_ROOT/bin:$PATH"
  fi
}

prim_check_postgres_credentials() {
  set +u
  # Check if the postgres credentials are defined. If they aren't then complain.
  if [ -z "$POSTGRES_PASSWORD" ] ||  [ -z "$POSTGRES_USER" ];
  then
    printf "Postgres credentials not defined! Please check configuration.\\n"
    return 1
  fi
  set -u
}


prim_create_folders_and_logs() {
  # Create the logging directory and file
  mkdir -p "${RAILS_LOG_PATH}/${RAILS_ENV}"
  touch "${RAILS_LOG_PATH}/${RAILS_ENV}.log"
  # Create the folder for the node modules that will be installed during asset
  # compile
  mkdir -p "${APP_ROOT}/node_modules"
}

# check if the bootstrap file has been created and set the env variable
# appropriated. we will rely on the env variable over the file because it is
# less places to change the path.
prim_check_for_bootstrap() {
  if [ -f "/.primero-bootstrapped" ];
  then
    printf "Bootstrap completion detected.\\n"
    return 1
  else
    printf "Bootstrap not detecting. Preparing to bootstrap.\\n"
    return 0
  fi
  export PRIM_BOOTSTRAP_COMPLETED
}

prim_bootstrap() {
  printf "Starting bootstrap\\n"
  # shellcheck disable=SC2034
  DISABLE_DATABASE_ENVIRONMENT_CHECK=1 rails db:drop
  bin/rails db:create
  bin/rails db:migrate
  bin/rails db:seed
  # rails sunspot:reindex # not working
  touch /.primero-bootstrapped
}

prim_start() {
  if prim_check_for_bootstrap;
  then
    prim_bootstrap
  fi
  bin/rails s
}

printf "Starting Primero application container\\n"

# if no argument is given then set the argument to start
if [[ "$#" -eq 0 ]];
then
  set -- primero-start
fi

printf "Performing configuration substitution"
# Search each of these directories for .template files and perform substitution
/sub.sh "/srv/primero/application/config"

prim_export_local_binaries
prim_check_for_bootstrap
prim_check_postgres_credentials
prim_create_folders_and_logs

# main argument execution loop.
# we are looking for any primero specific commands, execute them in order,
# and then exec anything else
while :; do
  case $1 in
    primero-bootstrap)
      prim_bootstrap
      shift
      ;;
    primero-start)
      prim_start
      shift
      ;;
    *)
      exec "$@"
      break
      ;;
  esac
done

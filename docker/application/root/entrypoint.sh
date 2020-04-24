#!/bin/bash

set -euox pipefail

# Finds and exports the binaries provided by primero
prim_export_local_binaries() {
  # if primero exists then prefer the rails / rails binaries from the repo
  if [ -d "$APP_ROOT/bin" ];
  then
    printf "Adding primero/bin to path\\n"
    export PATH="$APP_ROOT/bin:$PATH"
  fi
  return 0
}

# Check if the postgres credentials are defined. If they aren't then complain.
prim_check_postgres_credentials() {
  set +ux
  if [ -z "$POSTGRES_PASSWORD" ] ||  [ -z "$POSTGRES_USER" ];
  then
    printf "Postgres credentials not defined! Please check configuration.\\n"
    set -ux
    return 1
  fi
  set -ux
  return 0
}

# Checks for puma pid and removes it if neccesary. Sometimes it is left behind,
# after killing the container.
prim_check_for_puma_pid() {
  prim_pid_fd="/srv/primero/application/tmp/pids/server.pid"
  if [ -f "$prim_pid_fd" ];
  then
    printf "puma pid found. deleteing.\\n"
    rm -f "$prim_pid_fd";
  fi
  return 0
}


# Create the logging directory and file
prim_create_folders_and_logs() {
  mkdir -p "${RAILS_LOG_PATH}"
  touch "${RAILS_LOG_PATH}/${RAILS_ENV}.log"
  # Create the folder for the node modules that will be installed during asset
  # compile
  mkdir -p "${APP_ROOT}/node_modules"
  set +u
  if [[ "$RAILS_SCHEDULER_LOG_DIR" ]] ; then
    mkdir -p "$RAILS_SCHEDULER_LOG_DIR"
  fi
  set -u
  return 0
}

# check if the bootstrap file has been created and set the env variable
# appropriated. we will rely on the env variable over the file because it is
# less places to change the path.
prim_check_for_bootstrap() {
  current_db_version=$(bin/rails db:version || echo "EMPTY")
  db_empty=$(echo "${current_db_version}" | grep EMPTY)
  if [[ -n "${db_empty}" ]] ;
  then
    return 0
  else
    return 1
  fi
}

prim_stage_translations()  {
  translation_file=$(basename "$(find "${APP_ROOT}/public/" -name "translations*")")
  if [[ ! -f /share/public/${translation_file} ]] && [[ "${RAILS_PUBLIC_FILE_SERVER}" == "true" ]]
  then
    cp -Rrv "$APP_ROOT/public/translations-"* "$APP_ROOT/public/javascripts" "/share/public"
  fi
}

prim_generate_locations() {
  printf "Generating locations\\n"
  bin/rails location_files:generate
}

# this method is called to create a new primero instance from a clean container
prim_bootstrap() {
  printf "Starting bootstrap\\n"
  # shellcheck disable=SC2034
  bin/rails db:create
  bin/rails db:migrate
  set +u
  if [[ -n "${PRIMERO_CONFIGURATION_FILE}" ]]
  then
    bin/rails r "${PRIMERO_CONFIGURATION_FILE}"
  else
    bin/rails db:seed
  fi
  set -u
  prim_generate_locations
  return 0
}

prim_update() {
  printf "Updating primero\\n"
  bin/rails db:migrate
  bin/rails sunspot:reindex
  prim_stage_translations
  prim_generate_locations
  return 0
}

# method for starting puma
prim_start() {
  if prim_check_for_bootstrap;
  then
    printf "Primero needs to be bootstrapped.\\nBeginning bootstrap.\\n"
    prim_bootstrap
    bin/rails sunspot:reindex
    prim_stage_translations
  fi
  printf "Starting primero.\\n"
  prim_check_for_puma_pid
  bin/bundle exec puma -C config/puma.rb
}

# sets container to 'start' if no action is specified otherwise
prim_app_check_for_args() {
  # if no argument is given then set the argument to start
  if [[ "$#" -eq 0 ]];
  then
    set -- primero-start
  fi
}

# this method checks if a lock has been placed in the asset directory
# if so, return error 1.
# otherwise return 0 if previously unlocked and ready to proceed
prim_check_for_and_create_asset_lock() {
  # if the build-id exists in the change root
  if test -f "$LOCKFILE_PATH";
  then
    return 1
  else
    mkdir -p "$APP_SHARE_DIR"
    touch "$LOCKFILE_PATH"
    return 0
  fi
}

prim_remove_asset_lock() {
  rm -f "$LOCKFILE_PATH"
}

prim_copy_assets() {
  set +e
  # start by checking if we actually need to copy by diffing build-id
  mkdir -p "$APP_SHARE_DIR"
  touch "$APP_SHARE_DIR/build-id"
  cat "$APP_ROOT/public/build-id"
  cat "$APP_SHARE_DIR/build-id"
  diff -q "$APP_ROOT/public/build-id" "$APP_SHARE_DIR/build-id"
  # store return value of diff. should be 0 if they are the same. 1 otherwise.
  rc="$?"
  set -e
  # if these two files differ then copy
  if [ "$rc" -eq 1 ];
  then
    printf "Changes in assets detected.\\nCopying assets to shared directory\\n."
    cp -rv "$APP_ROOT/public" "/share"
  else
    printf "No asset update detecting. Skipping copy.\\n"
  fi

  prim_remove_asset_lock
}

# apps 'entrypoint' start. handles passed arguments and checks if bootstrap is
# neccesary.
prim_app_start() {
  printf "Starting Primero application container\\n"
  prim_app_check_for_args "$@"

  printf "Performing configuration substitution"
  # Search each of these directories for .template files and perform
  # substitution
  /sub.sh "/srv/primero/application/config"

  # if prim_check_for_and_create_asset_lock does not find a lockfile then copy
  # assets. otherwise, do not copy assets
  prim_check_for_and_create_asset_lock && prim_copy_assets
  prim_export_local_binaries
  prim_check_postgres_credentials
  prim_create_folders_and_logs

  case $1 in
    primero-bootstrap)
      prim_bootstrap
      ;;
    primero-start)
      prim_start
      ;;
    primero-update)
      prim_update
      prim_start
      ;;
    *)
      exec "$@"
      ;;
  esac
}

# pass all arguments to the prim_app_start method
prim_app_start "$@"

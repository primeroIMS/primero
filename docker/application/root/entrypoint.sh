#!/bin/bash

set -euxo pipefail

# Check if required environment variables are defined. If they aren't then complain.
check_required_variables() {
  local required
  local result

  result=0

  set +ux
  required=( PRIMERO_HOST POSTGRES_USER POSTGRES_PASSWORD PRIMERO_SECRET_KEY_BASE DEVISE_SECRET_KEY DEVISE_JWT_SECRET_KEY PRIMERO_MESSAGE_SECRET )
  for var in "${required[@]}"
  do
    if [ -z "${!var}" ]
    then
      printf "Missing required environment variable: ${var}\\n"
      result=1
    fi
  done
  set -ux
  return $result
}

# Idempotently migrate the database to the latest and greatest state
primero_migrate() {
  printf "Migrating the database\\n"
  set +u
  if [[ -z "${PRIMERO_PG_APP_ROLE}" ]]
  then
    # Create the database only if the db user is known to have the privilege
    bin/rails db:create
  fi
  set -u
  bin/rails db:migrate
}

# Apply a known configuration template
primero_configure() {
  set +u
  if [[ -n "${PRIMERO_CONFIGURATION_FILE}" ]]
  then
    printf "Applying configuration template\\n"
    bin/rails r "${PRIMERO_CONFIGURATION_FILE}"
  else
    printf "Applying seed configuration\\n"
    bin/rails db:seed
  fi
  set -u
}

# This method is called to bootstrap the database on a new instance of Primero
primero_bootstrap() {
  printf "Starting database and configuration bootstrap\\n"
  # shellcheck disable=SC2034
  primero_migrate
  primero_configure
}

# Start the Rails server
primero_start() {
  stage_assets
  bin/bundle exec puma -C config/puma.rb
}

stage_assets() {
  [[ "$RAILS_PUBLIC_FILE_SERVER" == "true" ]] && return 0

  printf "Staging public assets to shared directory $APP_SHARE_DIR"
  mkdir -p "$APP_SHARE_DIR"
  cp -rv "$APP_ROOT/public/"* "$APP_SHARE_DIR"
  return 0
}

# apps 'entrypoint' start. handles passed arguments and checks if bootstrap is
# neccesary.
primero_entrypoint() {
  printf "Starting Primero application container\\n"
  [[ "$#" -eq 0 ]] && set -- primero-start # set default arg
  check_required_variables
  export PATH="$APP_ROOT/bin:$PATH"

  printf "Performing configuration substitution"
  # Search each of these directories for .template files and perform
  # substitution
  /sub.sh "$APP_ROOT/config"

  case $1 in
    primero-bootstrap)
      primero_bootstrap
      ;;
    primero-start)
      primero_start
      ;;
    primero-migrate)
      primero_migrate
      ;;
    primero-configure)
      primero_configure
      ;;
    *)
      exec "$@"
      ;;
  esac
}

# pass all arguments to the main entrypoint method
primero_entrypoint "$@"

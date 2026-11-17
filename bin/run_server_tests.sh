#! /usr/bin/env bash
set -ex

export BITBUCKET=bitbucket
export GITHUB_ACTIONS=github-actions
export PIPELINE=${1:-bitbucket}
# TODO: Remove this variable once Solr is migrated
export SOLR_ENABLED=true

# Set up test environment
setup_test_env() {
  mkdir -p log
  cp "config/$PIPELINE/database.yml" config/
  cp "config/$PIPELINE/sunspot.yml" config/
  cp "config/$PIPELINE/mailers.yml" config/
  mkdir -p solr/data/test
  mkdir -p solr/cores/test
  mkdir -p tmp/storage

  export RAILS_ENV=test
  export DEVISE_JWT_SECRET_KEY=DEVISE_JWT_SECRET_KEY
  export DEVISE_SECRET_KEY=DEVISE_SECRET_KEY
}

# Create the database
setup_database() {
  bundle exec rails db:drop
  bundle exec rails db:create
  bundle exec rails db:migrate
}

setup_dependencies() {
  # Install Primero binary pre-requisites
  apt-get update
  apt install -y --no-install-recommends libpq-dev libsodium-dev
}

# Github Actions require passwordless sudo for installing packages
if [ "${PIPELINE}" == "${GITHUB_ACTIONS}" ]; then
  sudo bash -c "$(declare -f setup_dependencies); setup_dependencies"
else
  setup_dependencies
fi

# Github Actions automatically run bundler install when activating ruby. BB does not.
if [ "${PIPELINE}" == "${BITBUCKET}" ]; then
  bundle install --without production
fi

# TODO: Enable this once all bad interpolations are fixed on transifex
# Run check transifex interpolations
# ./bin/check_transifex_interpolations.sh

setup_test_env

# Run rubocop
bundle exec rubocop app lib config

setup_database

# Run tests
bundle exec rspec spec

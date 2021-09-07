#! /usr/bin/env bash

set -ex

BITBUCKET=bitbucket
GITHUB_ACTIONS=github_actions

PIPELINE=${1:-bitbucket}

# Set up test environment
setup_test_env() {
  mkdir -p log
  cp "config/$PIPELINE/database.yml" config/
  cp "config/$PIPELINE/sunspot.yml" config/
  cp "config/$PIPELINE/mailers.yml" config/
  mkdir -p solr/data/test
  mkdir -p solr/cores/test
  mkdir -p tmp/storage

  cp "config/$PIPELINE/core.properties" solr/cores/test/
  export RAILS_ENV=test
  export DEVISE_JWT_SECRET_KEY=DEVISE_JWT_SECRET_KEY
  export DEVISE_SECRET_KEY=DEVISE_SECRET_KEY
}

# Create the database
setup_database {
  bundle exec rails db:drop
  bundle exec rails db:create
  bundle exec rails db:migrate
}

add_postgres_sources() {
  wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O- | sudo apt-key add -
  echo "deb [arch=amd64] http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main" | sudo tee /etc/apt/sources.list.d/postgresql.list
}

setup_dependencies() {
  if [ $PIPELINE == $BITBUCKET ]; then 
    # Install JDK
    # TODO: This is for installing OpenJDK-8 which is no longer supported in Debian Buster.
    #       Change after we upgrade Solr
    wget -qO - https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | sudo apt-key add -
    echo "deb https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/ buster main" | sudo tee /etc/apt/sources.list.d/adoptopenjdk.list
    sudo apt update && sudo apt install -y adoptopenjdk-8-hotspot
  fi
  
  if [ $PIPELINE == $GITHUB_ACTIONS ]; then 
    add_postgres_sources
  fi

  # Install Rails pre-requisites
  sudo apt-get update
  sudo apt install -y --no-install-recommends postgresql-11 postgresql-client-11 libsodium-dev
  
  if [ $PIPELINE == $BITBUCKET ]; then 
    bundle install --without production
  fi
}

setup_dependencies
setup_test_env

if [ $PIPELINE == $BITBUCKET ]; then 
  bundle exec rails sunspot:solr:start
fi

setup_database

# Run tests
bundle exec rspec spec



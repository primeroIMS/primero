#! /usr/bin/env bash

set -ex

export BITBUCKET=bitbucket
export GITHUB_ACTIONS=github-actions
export PIPELINE=${1:-bitbucket}

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
setup_database() {
  bundle exec rails db:drop
  bundle exec rails db:create
  bundle exec rails db:migrate
}

setup_dependencies() {
  if [ $PIPELINE == $BITBUCKET ]; then 
    # Install JDK
    # TODO: This is for installing OpenJDK-8 which is no longer supported in Debian Buster.
    #       Change after we upgrade Solr
    wget -qO - https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | apt-key add -
    echo "deb https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/ buster main" | tee /etc/apt/sources.list.d/adoptopenjdk.list
    apt update && apt install -y adoptopenjdk-8-hotspot
  fi
  
  # Install Rails pre-requisites
  apt-get update
  apt install -y --no-install-recommends libpq-dev libsodium-dev
  
  if [ $PIPELINE == $BITBUCKET ]; then 
    bundle install --without production
  fi
}

if [ $PIPELINE == $GITHUB_ACTIONS ]; then 
  DEPS=`declare -f setup_dependencies`
  sudo -E bash -c "$DEPS; setup_dependencies"
else
  setup_dependencies
fi

setup_test_env

if [ $PIPELINE == $BITBUCKET ]; then 
  bundle exec rails sunspot:solr:start
fi

setup_database

# Run tests
bundle exec rspec spec



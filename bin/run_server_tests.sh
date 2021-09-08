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
  if [ $PIPELINE == $GITHUB_ACTIONS ]; then 
    wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O- | apt-key add -
    echo "deb [arch=amd64] http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main" | tee /etc/apt/sources.list.d/postgresql.list
  fi

  # Install Rails pre-requisites
  apt-get update
  apt install -y --no-install-recommends postgresql-11 postgresql-client-11 libsodium-dev
  
  if [ $PIPELINE == $BITBUCKET ]; then 
    bundle install
  fi
}

if [ $PIPELINE == $GITHUB_ACTIONS ]; then 
  DEPS=`declare -f setup_dependencies`
  sudo -E bash -c "$DEPS; setup_dependencies"
else
  setup_dependencies
fi

setup_test_env
setup_database

# Run tests
bundle exec rspec spec



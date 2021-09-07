#! /usr/bin/env bash

set -ex

TEST_CONFIG_DIR=${1:-bitbucket}

setup_java_solr() {
  # Install JDK
  # TODO: This is for installing OpenJDK-8 which is no longer supported in Debian Buster.
  #       Change after we upgrade Solr
  wget -qO - https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | sudo apt-key add -
  echo "deb https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/ buster main" | sudo tee /etc/apt/sources.list.d/adoptopenjdk.list
  sudo apt update && sudo apt install -y adoptopenjdk-8-hotspot
}

add_postgres_sources() {
  wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O- | sudo apt-key add -
  echo "deb [arch=amd64] http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main" | sudo tee /etc/apt/sources.list.d/postgresql.list
}

solr_responding() {
  curl -o /dev/null "http://localhost:8983/solr/admin/ping" > /dev/null 2>&1
}

start_solr_server() {
  bundle exec rails sunspot:solr:start

  curl "http://localhost:8983/solr/admin/ping"

  while ! solr_responding; do
    /bin/echo -n "."
    sleep 1
  done
  /bin/echo "done."
}

setup_java_solr
add_postgres_sources


# Install Rails pre-requisites
sudo apt-get update
sudo apt install -y --no-install-recommends postgresql-11 postgresql-client-11 libsodium-dev

# bundle install --without production

# Set up test environment
mkdir -p log
cp "config/$TEST_CONFIG_DIR/database.yml" config/
cp "config/$TEST_CONFIG_DIR/sunspot.yml" config/
cp "config/$TEST_CONFIG_DIR/mailers.yml" config/
mkdir -p solr/data/test
mkdir -p solr/cores/test
mkdir -p tmp/storage

cp "config/$TEST_CONFIG_DIR/core.properties" solr/cores/test/
export RAILS_ENV=test
export DEVISE_JWT_SECRET_KEY=DEVISE_JWT_SECRET_KEY
export DEVISE_SECRET_KEY=DEVISE_SECRET_KEY

env | sort
start_solr_server

# Create the database
bundle exec rails db:drop
bundle exec rails db:create
bundle exec rails db:migrate

# Run tests
bundle exec rspec spec

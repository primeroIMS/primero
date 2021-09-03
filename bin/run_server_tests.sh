#! /usr/bin/env bash

set -ex

TEST_CONFIG_DIR=${1:-bitbucket}

# Install JDK
# TODO: This is for installing OpenJDK-8 which is no longer supported in Debian Buster.
#       Change after we upgrade Solr
wget -qO - https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | apt-key add -
echo "deb https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/ buster main" | tee /etc/apt/sources.list.d/adoptopenjdk.list
apt update && apt install -y adoptopenjdk-8-hotspot

# Install Rails pre-requisites
apt-get update
apt install -y --no-install-recommends postgresql-11 postgresql-client-11 libsodium-dev

bundle config path vendor/bundle
bundle install --without production --jobs 4 --retry 3

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

# Start Solr
bundle exec rails sunspot:solr:start

# Create the database
bundle exec rails db:drop
bundle exec rails db:create
bundle exec rails db:migrate

# Run tests
bundle exec rspec spec

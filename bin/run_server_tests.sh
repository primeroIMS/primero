#! /usr/bin/env bash

set -ex

# Install JDK
# TODO: This is for installing OpenJDK-8 which is no longer supported in Debian Buster.
#       Change after we upgrade Solr
wget -qO - https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | apt-key add -
echo "deb https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/ buster main" | tee /etc/apt/sources.list.d/adoptopenjdk.list
apt update && apt install -y adoptopenjdk-8-hotspot

# Install Rails pre-requisites
apt-get update
apt install -y --no-install-recommends postgresql-11 postgresql-client-11 libsodium-dev
bundle install

# Set up test environment
mkdir -p log
cp config/bitbucket/database.yml config/
cp config/bitbucket/sunspot.yml config/
cp config/bitbucket/mailers.yml config/
mkdir -p solr/data/test
mkdir -p solr/cores/test
cp config/bitbucket/core.properties solr/cores/test/
export RAILS_ENV=test
export DEVISE_JWT_SECRET_KEY=DEVISE_JWT_SECRET_KEY
export DEVISE_SECRET_KEY=DEVISE_SECRET_KEY

# Start Solr
rails sunspot:solr:start

# Create the database
rails db:drop
rails db:create
rails db:migrate

# Run tests
rspec spec

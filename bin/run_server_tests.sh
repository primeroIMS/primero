#! /usr/bin/env bash

set -ex

# Install Rails pre-requisites
apt-get update
apt install -y --no-install-recommends postgresql-11 postgresql-client-11 libsodium-dev
# bundle install --without production

# Set up test environment
mkdir -p log
cp config/bitbucket/database.yml config/
cp config/bitbucket/sunspot.yml config/
cp config/bitbucket/mailers.yml config/

export RAILS_ENV=test
export DEVISE_JWT_SECRET_KEY=DEVISE_JWT_SECRET_KEY
export DEVISE_SECRET_KEY=DEVISE_SECRET_KEY

# # Create the database
# rails db:drop
# rails db:create
# rails db:migrate

# # Run tests
# rspec spec

#!/bin/bash

set -ex
# rake db:setup
DISABLE_DATABASE_ENVIRONMENT_CHECK=1 bundle exec rake db:drop
bundle exec rake db:create
bundle exec rake db:migrate
# bundle exec rake db:migrate:design
bundle exec rake db:seed
bundle exec rails s

#!/bin/bash

rake db:setup
rake db:migrate
rake db:migrate:design
rake db:seed

bundle exec rails s

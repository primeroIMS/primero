# frozen_string_literal: true

# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)
require 'rake'
require 'rake/dsl_definition'
require 'backburner/tasks'

include Rake::DSL

# We should only set PRIMERO_WAIT_FOR_DB when we launch daemons or the app server.
# Right now, this only applies to the Backburner queue worker and Scheduler
# These are launched via Rake tasks.
# TODO: Once we clean up the Docker application entrypoint, pull out the db:version check
ENV['PRIMERO_WAIT_FOR_DB'] = 'true' if Rake.application.top_level_tasks.any?(/^(backburner:)|(scheduler:)|(db:version)/)

Rails.application.load_tasks

# frozen_string_literal: true

# This file is used by Rack-based servers to start the application.
# Setting PRIMERO_WAIT_FOR_DB for all server processes.
# We should only wait for for the database when we launch daemons or the app server.
ENV['PRIMERO_WAIT_FOR_DB'] = 'true'
require ::File.expand_path('../config/environment', __FILE__)
run Rails.application

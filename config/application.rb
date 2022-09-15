# frozen_string_literal: true

require_relative 'boot'

# Expanding the below requires to remove loading of sprockets
# If we upgrade rails in the future, make sure to check the following
# imports to ensure we don't missing loading of anything important or new.
# require 'rails/all'
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_view/railtie'
require 'active_storage/engine'

Bundler.require(*Rails.groups)

# Main Rails module for Primero
module Primero; end
# Main Rails application class for Primero
class Primero::Application < Rails::Application
  config.load_defaults 6.1

  # Settings in config/environments/* take precedence over those specified here.
  # Application configuration should go into files in config/initializers
  # -- all .rb files in that directory are automatically loaded.
  overrides = "#{Rails.root}/app/overrides"
  Rails.autoloaders.main.ignore(overrides)
  config.to_prepare do
    Dir.glob("#{overrides}/**/*.rb").each do |override|
      load override
    end
  end
  config.enable_dependency_loading = true
  # Custom directories with classes and modules you want to be autoloadable.
  load_paths = %W[
    #{config.root}/lib
    #{config.root}/lib/extensions
  ]
  config.autoload_paths += load_paths
  config.eager_load_paths += load_paths

  config.middleware.use Rack::Deflater

  config.cache_store = :memory_store

  # I18n deprecation
  config.i18n.enforce_available_locales = false

  I18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]

  # Configure the default encoding used in templates for Ruby 1.9.
  config.encoding = 'utf-8'

  # Configure sensitive parameters which will be filtered from the log file.
  config.filter_parameters += %w[
    password encrypted_password data location phone
    email code full_name reporting_location_code
    agency_office reset_password_token record_changes
    notes message
  ]

  ENV['RAILS_LOG_PATH'].present? &&
    config.paths['log'] = "#{ENV['RAILS_LOG_PATH']}/#{ENV['RAILS_ENV']}.log"

  config.beginning_of_week = :sunday

  config.log_level = :debug

  config.action_view.logger = nil

  config.exceptions_app = routes
end

require File.expand_path('version', __dir__)

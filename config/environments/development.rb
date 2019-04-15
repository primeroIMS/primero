Rails.application.configure do

  # Settings specified here will take precedence over those in config/environment.rb

  # The production environment is meant for finished, "live" apps.
  # Code is not reloaded between requests
  config.cache_classes = ENV['CACHE_CLASSES'] == 'no' ? false : true

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local = true
  config.action_controller.perform_caching = ENV['CACHE_CLASSES'] == 'no' ? false : true

  # See everything in the log (default is :info)
  config.log_level = :debug

  # For nginx:
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect'

  # Asset pipeline
  config.assets.compress = false
  config.assets.debug = ENV['DEBUG_ASSETS'] == 'no' ? false : true

  config.eager_load = ENV['PROFILE'] == 'true' ? true : false

  # BetterErrors::Middleware.allow_ip! ENV['TRUSTED_IP'] if ENV['TRUSTED_IP']
  BetterErrors::Middleware.allow_ip! "0.0.0.0/0"

  config.action_mailer.raise_delivery_errors = false

  # Store uploaded files on the local file system (see config/storage.yml for options)
  config.active_storage.service = :local
end

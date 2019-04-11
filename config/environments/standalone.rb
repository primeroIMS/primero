Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # The production environment is meant for finished, "live" apps.
  # Code is not reloaded between requests
  config.cache_classes = true

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true
  config.serve_static_files = true

  # Send deprecation notices to registered listeners
  config.active_support.deprecation = :notify

  # Asset pipeline
  config.assets.compress = true
  config.assets.compile = false
  config.assets.digest = true

  config.eager_load = false

  # Store uploaded files on the local file system (see config/storage.yml for options)
  config.active_storage.service = :local
end

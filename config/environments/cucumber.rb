Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  config.cache_classes = true
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = true

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin

  # Asset pipeline
  config.serve_static_files = true
  config.static_cache_control = "public, max-age=3600"

  config.eager_load = false

  # Store uploaded files on the local file system (see config/storage.yml for options)
  config.active_storage.service = :local
end

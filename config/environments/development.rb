Rails.application.configure do

  config.cache_classes = false
  config.action_controller.perform_caching = false
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local = true
  # See everything in the log (default is :info)
  config.log_level = :debug

  # Asset pipeline
  # config.assets.debug = false
  # config.assets.quiet = true
  # config.assets.enabled = false
  # config.assets.version = '1.0'
  # config.assets.check_precompiled_asset = false
  # config.public_file_server.enabled = true

  config.eager_load = ENV['PROFILE'] == 'true' ? true : false

  config.action_mailer.raise_delivery_errors = false

  # Store uploaded files on the local file system (see config/storage.yml for options)
  config.active_storage.service = :local
end

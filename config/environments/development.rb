# frozen_string_literal: true

Rails.application.configure do
  config.cache_classes = false
  config.action_controller.perform_caching = false
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local = true
  # See everything in the log (default is :info)
  config.log_level = :debug

  config.eager_load = ENV['PROFILE'] == 'true'

  config.action_mailer.raise_delivery_errors = false

  # Store uploaded files on the local file system (see config/storage.yml for options)
  storage_type = %w[test local microsoft amazon].find do |t|
    t == ENV['PRIMERO_STORAGE_TYPE']
  end || 'local'
  config.active_storage.service = storage_type
end

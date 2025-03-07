# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

Rails.application.configure do
  config.cache_classes = false
  config.action_controller.perform_caching = false
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker
  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local = true
  config.eager_load = ENV['PROFILE'] == 'true'
  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.delivery_method = :letter_opener

  $stdout.sync = true
  logger = ActiveSupport::Logger.new($stdout)
  logger.formatter = Logger::Formatter.new
  config.logger = ActiveSupport::TaggedLogging.new(logger)
  config.log_tags = [
    :request_id, ->(_request) { LogUtils.thread_id }, ->(request) { LogUtils.remote_ip(request) }
  ]

  # Store uploaded files on the local file system (see config/storage.yml for options)
  storage_type = %w[test local microsoft amazon].find do |t|
    t == ENV['PRIMERO_STORAGE_TYPE']
  end || 'local'
  config.active_storage.service = storage_type
end

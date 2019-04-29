Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # The test environment is used exclusively to run your application's
  # test suite.  You never need to work with it otherwise.  Remember that
  # your test database is "scratch space" for the test suite and is wiped
  # and recreated between test runs.  Don't rely on the data there!
  config.cache_classes = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Raise exceptions instead of rendering exception templates
  config.action_dispatch.show_exceptions = false

  # Disable request forgery protection in test environment
  config.action_controller.allow_forgery_protection    = false

  # Print deprecation notices to the stderr
  config.active_support.deprecation = :stderr

  # Asset pipeline
  config.public_file_server.enabled = true
  config.public_file_server.headers = { 'Cache-Control' => 'public, max-age=3600' }
  # config.serve_static_files = true
  # config.static_cache_control = "public, max-age=3600"

  config.eager_load = false

  config.middleware.use RackSessionAccess::Middleware
  config.log_level = :debug

  # Store uploaded files on the local file system (see config/storage.yml for options)
  config.active_storage.service = :local
end

Rails.application.configure do
  # The production environment is meant for finished, "live" apps.
  # Code is not reloaded between requests
  config.cache_classes = true

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Specifies the header that your server uses for sending files
  config.action_dispatch.x_sendfile_header = "X-Sendfile"

  # Disable Rails's static asset server
  # In production, Apache or nginx will already do this
  config.public_file_server.enabled = false
  # config.serve_static_files = false

  # Send deprecation notices to registered listeners
  config.active_support.deprecation = :notify

  # Asset pipeline
  config.assets.compress = true
  config.assets.compile = true
  config.assets.digest = true
  config.assets.js_compressor = :uglifier
  config.assets.css_compressor = :sass
  config.assets.cache_store = :memory_store
  config.public_file_server.enabled = ENV['RAILS_PUBLIC_FILE_SERVER'] == 'true'

  config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect'

  config.assets.paths << Rails.root.join("assets")

  config.eager_load = true

  config.filter_parameters += [:child, :incident, :tracing_request]

  config.log_level = :debug

  # WARNING **
  # NEVER UNSET THIS OR YOU WILL BREAK THINGS!
  # config.force_ssl = true

  # Store uploaded files on the local file system (see config/storage.yml for options)
  config.active_storage.service = :local
end

# frozen_string_literal: true

# Custom miscellaneous Primero configurations, pulled from the environment
Rails.application.configure do
  # The directory where bulk export files are placed.
  # When running with Docker/K8s this needs to point to a volume
  exports_directory = ENV['PRIMERO_EXPORTS_DIR'] || File.join(Rails.root, 'tmp', 'export')
  config.exports_directory = exports_directory

  # Path to the i18n translation strings used by the front end
  manifest = Rails.root.join('config', 'i18n-manifest.txt')
  config.i18n_translations_file = File.exist?(manifest) ? File.open(manifest).read : nil

  # Show the UI in Sandbox mode.
  config.sandbox_ui = ::ActiveRecord::Type::Boolean.new.cast(ENV['PRIMERO_SANDBOX_UI']) || false

  # Configuration UI indicator
  config.config_ui = %w[full limited].include?(ENV['PRIMERO_CONFIG_UI']) ? ENV['PRIMERO_CONFIG_UI'] : 'full'

  config.use_app_cache = Rails.env.production? || ::ActiveRecord::Type::Boolean.new.cast(ENV['PRIMERO_USE_APP_CACHE'])
end

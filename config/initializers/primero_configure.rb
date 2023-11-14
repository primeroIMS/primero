# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Custom miscellaneous Primero configurations, pulled from the environment
Rails.application.configure do
  # The directory where bulk export files are placed.
  # When running with Docker/K8s this needs to point to a volume
  exports_directory = ENV['PRIMERO_EXPORTS_DIR'] || File.join(Rails.root, 'tmp', 'export')
  config.exports_directory = exports_directory

  # Path to the i18n translation strings used by the front end
  manifest = Rails.root.join('config', 'i18n-manifest.txt')
  config.i18n_translations_file = File.exist?(manifest) ? File.read(manifest) : nil

  # Show the UI in Sandbox mode.
  config.sandbox_ui = ActiveRecord::Type::Boolean.new.cast(ENV.fetch('PRIMERO_SANDBOX_UI', nil)) || false

  # Configuration UI indicator
  config.config_ui = %w[full limited].include?(ENV['PRIMERO_CONFIG_UI']) ? ENV['PRIMERO_CONFIG_UI'] : 'full'

  config.use_app_cache = Rails.env.production? || ActiveRecord::Type::Boolean.new.cast(ENV.fetch(
                                                                                         'PRIMERO_USE_APP_CACHE', nil
                                                                                       ))

  config.use_theme = ActiveRecord::Type::Boolean.new.cast(ENV.fetch('PRIMERO_USE_THEME', nil)) || false                                                                                      
end

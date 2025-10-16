# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Custom miscellaneous Primero configurations, pulled from the environment

def load_settings
  settings_file = Rails.root.join('config', 'captcha.yml')
  return {} unless File.exist?(settings_file)

  YAML.safe_load(ERB.new(File.read(settings_file)).result) || {}
end

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

  config.use_csrf_protection = ActiveRecord::Type::Boolean.new.cast(ENV.fetch('PRIMERO_USE_CSRF_PROTECTION', true))

  config.allow_self_registration = ActiveRecord::Type::Boolean.new.cast(ENV.fetch('PRIMERO_ALLOW_SELF_REGISTRATION',
                                                                                  false))

  config.silence_logging = [
    'GET /health', 'GET /health/database', 'GET /health/solr', 'GET /health/server'
  ]

  @captcha_settings = load_settings if ENV.fetch('PRIMERO_CAPTCHA_PROVIDER', nil).present?
  config.captcha_provider = ENV.fetch('PRIMERO_CAPTCHA_PROVIDER', nil)
  config.captcha = @captcha_settings&.dig(config.captcha_provider) || {}
end

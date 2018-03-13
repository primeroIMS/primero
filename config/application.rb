# encoding: utf-8

require File.expand_path('../boot', __FILE__)

require "action_controller/railtie"
#Bundler.require *Rails.groups(:assets => %w(development test))
Bundler.require(:default, :assets, Rails.env)

module Primero
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    config.autoload_paths += %W(
      #{config.root}/lib
      #{config.root}/lib/schedules
      #{config.root}/lib/primero
      #{config.root}/lib/extensions
      #{config.root}/app/presenters
      #{config.root}/app
    )

    # I18n deprecation
    config.i18n.enforce_available_locales = false

    I18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # i18n-js recommended configuration.
    config.assets.initialize_on_precompile = true

    # Asset pipeline
    config.assets.enabled = true
    config.assets.version = '1.0'

    #LOCALES = ['en','fr','ar','zh','es','ru']
    #LOCALES_WITH_DESCRIPTION = [['-', nil],['العربية','ar'],['中文','zh'],['English', 'en'],['Français', 'fr'],['Русский', 'ru'],['Español', 'es']]
    LOCALES = ['en','fr','ar','es']
    LOCALES_WITH_DESCRIPTION = [['-', nil],['English', 'en'],['Français', 'fr'],['العربية','ar'],['Español', 'es']]

    if ENV['RAILS_LOG_PATH'].present?
      config.paths['log'] = "#{ENV['RAILS_LOG_PATH']}/#{ENV['RAILS_ENV']}.log"
    end

    config.logger = Logger.new(config.paths['log'].first, 1, 50.megabytes)
    config.action_view.logger = nil

    config.couch_watcher_log_level = Logger::DEBUG

    def locales
      LOCALES
    end

    def locales_with_description
      LOCALES_WITH_DESCRIPTION
    end
  end
end

require File.expand_path('../version', __FILE__)

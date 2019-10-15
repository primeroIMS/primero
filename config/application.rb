require_relative 'boot'

# require 'rails/all'

require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "active_storage/engine"

Bundler.require(*Rails.groups)

module Primero
  class Application < Rails::Application
    config.load_defaults 5.2

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.enable_dependency_loading = true
    # Custom directories with classes and modules you want to be autoloadable.
    config.autoload_paths += %W(
      #{config.root}/lib
      #{config.root}/lib/primero
      #{config.root}/lib/extensions
    )

    # I18n deprecation
    config.i18n.enforce_available_locales = false

    I18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # Asset pipeline
    # config.assets.debug = false
    # config.assets.quiet = true
    # config.assets.enabled = false
    # config.assets.version = '1.0'
    # config.assets.check_precompiled_asset = false

    LOCALE_ENGLISH = 'en'
    LOCALE_FRENCH = 'fr'
    LOCALE_ARABIC = 'ar'
    LOCALE_SPANISH = 'es'
    LOCALE_LEBANON = 'ar-LB'
    LOCALE_SOMALI = 'so'
    LOCALE_BANGLA = 'bn'
    LOCALE_INDONESIAN = 'id'
    LOCALE_BURMESE = 'my'
    LOCALE_THAI = 'th'
    LOCALE_KURDISH = 'ku'
    LOCALES = [LOCALE_ENGLISH, LOCALE_FRENCH, LOCALE_ARABIC, LOCALE_LEBANON, LOCALE_SOMALI, LOCALE_SPANISH, LOCALE_BANGLA,
               LOCALE_INDONESIAN, LOCALE_BURMESE, LOCALE_THAI, LOCALE_KURDISH]
    LOCALES_WITH_DESCRIPTION = [
      ['-', nil],
      ['English', LOCALE_ENGLISH],
      ['Français', LOCALE_FRENCH],
      ['العربية', LOCALE_ARABIC],
      ['العربية (اللبنانية)', LOCALE_LEBANON],
      ['Af-Soomaali', LOCALE_SOMALI],
      ['Español', LOCALE_SPANISH],
      ['বাংলা', LOCALE_BANGLA],
      ['Bahasa', LOCALE_INDONESIAN],
      ['ဗမာစာ', LOCALE_BURMESE],
      ['ไทย', LOCALE_THAI],
      ['کوردی', LOCALE_KURDISH]
    ]
    RTL_LOCALES = [
      LOCALE_ARABIC,
      LOCALE_LEBANON,
      LOCALE_KURDISH
    ]
    BASE_LANGUAGE = LOCALE_ENGLISH

    if ENV['RAILS_LOG_PATH'].present?
      config.paths['log'] = "#{ENV['RAILS_LOG_PATH']}/#{ENV['RAILS_ENV']}.log"
    end

    config.logger = Logger.new(config.paths['log'].first, 1, 50.megabytes)
    config.action_view.logger = nil

    config.exceptions_app = self.routes

    def locales
      @locales ||= I18n.available_locales.map(&:to_s)
    end

    def locales_with_description
      @locales_with_description ||= LOCALES_WITH_DESCRIPTION.select{|l| (locales.include? l.last) || l.last.nil?}
    end

    def default_locale
      @default_locale ||= I18n.default_locale.to_s
    end
  end
end

require File.expand_path('../version', __FILE__)

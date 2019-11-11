# encoding: utf-8

require File.expand_path('../boot', __FILE__)

require "action_controller/railtie"
require "action_mailer/railtie"

#Bundler.require *Rails.groups(:assets => %w(development test))
Bundler.require(:default, :assets, Rails.env)

module Primero
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.enable_dependency_loading = true
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

    config.assets.precompile += [
      'application_ltr.scss',
      'application_rtl.scss'
    ]

    LOCALE_ENGLISH = 'en'
    LOCALE_FRENCH = 'fr'
    LOCALE_ARABIC = 'ar'
    LOCALE_SPANISH = 'es'
    LOCALE_LEBANON = 'ar-LB'
    LOCALE_JORDAN = 'ar_JO'
    LOCALE_SOMALI = 'so'
    LOCALE_BANGLA = 'bn'
    LOCALE_INDONESIAN = 'id'
    LOCALE_BURMESE = 'my'
    LOCALE_THAI = 'th'
    LOCALE_KURDISH = 'ku'
    LOCALE_PORTUGUESE = 'pt'
    LOCALES = [LOCALE_ENGLISH, LOCALE_FRENCH, LOCALE_ARABIC, LOCALE_LEBANON, LOCALE_SOMALI, LOCALE_SPANISH, LOCALE_BANGLA,
               LOCALE_INDONESIAN, LOCALE_BURMESE, LOCALE_THAI, LOCALE_KURDISH, LOCALE_PORTUGUESE, LOCALE_JORDAN]
    LOCALES_WITH_DESCRIPTION = [
      ['-', nil],
      ['English', LOCALE_ENGLISH],
      ['Français', LOCALE_FRENCH],
      ['العربية', LOCALE_ARABIC],
      ['العربية (اللبنانية)', LOCALE_LEBANON],
      ['Af-Soomaali', LOCALE_SOMALI],
      ['Español', LOCALE_SPANISH],
      ['Português', LOCALE_PORTUGUESE],
      ['বাংলা', LOCALE_BANGLA],
      ['Bahasa', LOCALE_INDONESIAN],
      ['ဗမာစာ', LOCALE_BURMESE],
      ['ไทย', LOCALE_THAI],
      #TODO: confirm the correct description
      ['العربية (Jordan)', LOCALE_JORDAN],
      ['کوردی', LOCALE_KURDISH]
    ]
    RTL_LOCALES = [
      LOCALE_ARABIC,
      LOCALE_LEBANON,
      LOCALE_KURDISH,
      LOCALE_JORDAN
    ]

    if ENV['RAILS_LOG_PATH'].present?
      config.paths['log'] = "#{ENV['RAILS_LOG_PATH']}/#{ENV['RAILS_ENV']}.log"
    end

    config.logger = Logger.new(config.paths['log'].first, 1, 50.megabytes)
    config.action_view.logger = nil

    config.couch_watcher_log_level = Logger::DEBUG

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

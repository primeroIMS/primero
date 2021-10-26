# frozen_string_literal: true

# This specifies the locales the Primero currently supports
#
# ku-IQ: This locale represents the Kurdish Badini subdialect of Kurmanji, as spoken in Dohuk in
#        Western Iraqi Kurdistan Region and North-East Syria
# ku:    This locale represents the Kurdish Sorani (Central Kurdish) dialect as spoken in
#        Eastern Iraqi Kurdistan Region (Erbil, Sulamaniya)
class Primero::Application
  LOCALE_ENGLISH = :en
  LOCALE_ARABIC = :ar
  LOCALES = %i[
    en ar ar-IQ ar-JO ar-LB ar-SD bn es es-GT fa-AF fr id km ku ku-IQ my ps-AF pt pt-BR so sw-KE sw-TZ th
  ].freeze
  RTL_LOCALES = %i[ar ar-IQ ar-JO ar-LB ar-SD fa-AF ku ku-IQ ps-AF].freeze
end

def locale_settings
  return @locale_settings if @locale_settings

  settings_file = Rails.root.join('config', 'locales.yml')
  return {} unless File.exist?(settings_file)

  @locale_settings = YAML.load_file(settings_file)[Rails.env] || {}
end

I18n.default_locale = locale_settings['default_locale'] || Primero::Application::LOCALE_ENGLISH
I18n.available_locales = if locale_settings['locales'].present?
                           locale_settings['locales']
                         else
                           Primero::Application::LOCALES
                         end

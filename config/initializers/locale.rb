yaml_file = "#{Rails.root.to_s}/config/locales.yml"
locale_settings = YAML::load(File.open(yaml_file))[Rails.env.to_s] if File.exists?(yaml_file)
if locale_settings.present?
  I18n.default_locale = locale_settings[:default_locale].present? ? locale_settings[:default_locale] : Primero::Application::LOCALE_ENGLISH
  I18n.available_locales = locale_settings[:locales].present? ? locale_settings[:locales] : Primero::Application::LOCALES
else
  I18n.default_locale = Primero::Application::LOCALE_ENGLISH
  I18n.available_locales = Primero::Application::LOCALES
end

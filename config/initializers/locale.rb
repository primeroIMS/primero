LOCALES_FROM_ENV = ENV['LOCALE_ALL'].try(:split, ',') || %w(en fr ar)

default_locale = nil
yaml_file = Rails.root.join("config", "locales.yml")
locale_settings = YAML::load(ERB.new(File.read(yaml_file)).result)[Rails.env] if File.exists?(yaml_file)

begin
  if ActiveRecord::Base.connection.table_exists? :system_settings
    default_locale = ActiveRecord::Base.connection.select_all("SELECT default_locale FROM system_settings LIMIT 1")
                                         .rows
                                         .flatten
                                         .first
  end
rescue ActiveRecord::NoDatabaseError => e
  Rails.logger.error e.message
end

if locale_settings.present?
  default_locale ||= locale_settings[:default_locale] if locale_settings[:default_locale].present?
  I18n.available_locales = locale_settings[:locales].present? ? locale_settings[:locales] : Primero::Application::LOCALES
else
  default_locale ||= Primero::Application::LOCALE_ENGLISH
  I18n.available_locales = Primero::Application::LOCALES
end

I18n.default_locale = default_locale || Primero::Application::LOCALE_ENGLISH

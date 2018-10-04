default_locale = nil
#check SystemSettings first for backwards compatibility
docs = SystemSettings.database.documents['rows']
if docs.present?
  doc_id = docs.map{|d| d['id']}.select{|i| !i.start_with?('_design')}.first
  if doc_id.present?
    saved_settings = SystemSettings.database.get(doc_id)
    if saved_settings.present? && saved_settings['default_locale'].present?
      default_locale = saved_settings['default_locale']
    end
  end
end


yaml_file = "#{Rails.root.to_s}/config/locales.yml"
locale_settings = YAML::load(File.open(yaml_file))[Rails.env.to_s] if File.exists?(yaml_file)
if locale_settings.present?
  default_locale ||= locale_settings[:default_locale] if locale_settings[:default_locale].present?
  I18n.available_locales = locale_settings[:locales].present? ? locale_settings[:locales] : Primero::Application::LOCALES
else
  default_locale ||= Primero::Application::LOCALE_ENGLISH
  I18n.available_locales = Primero::Application::LOCALES
end

I18n.default_locale = default_locale || Primero::Application::LOCALE_ENGLISH

#Set default locales first... will be overridden below if SystemSettings exist
I18n.available_locales = Primero::Application::LOCALES
docs = SystemSettings.database.documents['rows']
if docs.present?
  doc_id = docs.map{|d| d['id']}.select{|i| !i.start_with?('_design')}.first
  if doc_id.present?
    saved_settings = SystemSettings.database.get(doc_id)
    if saved_settings.present?
      I18n.default_locale = saved_settings['default_locale'].present? ? saved_settings['default_locale'] : Primero::Application::LOCALE_ENGLISH
      I18n.available_locales = saved_settings['locales'].present? ? saved_settings['locales'] : Primero::Application::LOCALES
    end
  end
end

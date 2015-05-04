#sysSettings = SystemSettings.first
docs = SystemSettings.database.documents['rows']
if docs.present?
  doc_id = docs.map{|d| d['id']}.select{|i| !i.start_with?('_design')}.first
  if doc_id.present?
    saved_settings = SystemSettings.database.get(doc_id)
    if saved_settings.present? && saved_settings['default_locale'].present?
      I18n.default_locale = saved_settings['default_locale']
    end
  end
end

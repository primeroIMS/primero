db = COUCHDB_SERVER.database!("primero_location_#{Rails.env}")
system_settings_db = COUCHDB_SERVER.database!("primero_system_settings_#{Rails.env}")
system_settings_docs = system_settings_db.all_docs['rows']
if system_settings_docs.present? && system_settings_docs.size >= 2 && db.all_docs['rows'].present? && OptionsQueueStats.options_not_generated?
  OptionsJob.perform_now
end

db = COUCHDB_SERVER.database!("primero_location_#{Rails.env}")

if db.all_docs['rows'].present? && OptionsQueueStats.options_not_generated?
  OptionsJob.perform_now
end

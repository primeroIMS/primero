db = COUCHDB_SERVER.database!("primero_location_#{Rails.env}")

if OptionsQueueStats.options_not_generated? && db.all_docs['row'].present?
  OptionsJob.perform_now
end
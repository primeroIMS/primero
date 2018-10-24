db = COUCHDB_SERVER.database!("primero_location_#{Rails.env}")

if OptionsQueueStats.options_not_generated? && db.all_docs['rows'].present?
  OptionsJob.perform_now
end

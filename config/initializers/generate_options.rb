begin
  if ActiveRecord::Base.connection.table_exists? :system_settings
    count = ActiveRecord::Base.connection.select_all("SELECT COUNT(id) FROM system_settings")
                                         .rows
                                         .flatten
                                         .first
    if count.positive?
      OptionsJob.perform_now
    end
  end
rescue ActiveRecord::NoDatabaseError => e
  puts e.message
end

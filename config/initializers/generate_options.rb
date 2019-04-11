if ActiveRecord::Base.connection.table_exists? :locations
  count = ActiveRecord::Base.connection.select_all("SELECT COUNT(id) FROM locations")
                                       .rows
                                       .flatten
                                       .first
  if count.positive?
    OptionsJob.perform_now
  end
end

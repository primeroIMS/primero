# This has to be after initialize because we need to load first the locale first
Rails.application.config.after_initialize do
  begin
    if ActiveRecord::Base.connection.table_exists?(:locations) && ActiveRecord::Base.connection.table_exists?(:system_settings)
      count_system_settings = ActiveRecord::Base.connection.select_all("SELECT COUNT(id) FROM locations")
                                           .rows
                                           .flatten
                                           .first

      count_locations = ActiveRecord::Base.connection.select_all("SELECT COUNT(id) FROM system_settings")
                                           .rows
                                           .flatten
                                           .first
      if count_system_settings.positive? && count_locations.positive?
        GenerateLocationFilesJob.perform_now
      end
    end
  rescue ActiveRecord::NoDatabaseError => e
    Rails.logger.error e.message
  end
end

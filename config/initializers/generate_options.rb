# This has to be after initialize because we need to load first the locale first
Rails.application.config.after_initialize do
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
    Rails.logger.error e.message
  end
end

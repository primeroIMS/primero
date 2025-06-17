# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# This has to be after initialize because we need to load first the locale first
Rails.application.config.after_initialize do
  Rails.logger.info 'Generating locations JSON file on server boot'
  begin
    if ActiveRecord::Base.connection.table_exists?(:locations) &&
       ActiveRecord::Base.connection.table_exists?(:system_settings)
      count_locations = ActiveRecord::Base.connection.select_all('SELECT COUNT(id) FROM locations').rows.flatten.first
      system_settings = ActiveRecord::Base.connection.execute(
        "
          SELECT attachments.id IS NOT NULL AS has_locations_attachment
          FROM system_settings
          LEFT JOIN active_storage_attachments AS attachments
            ON attachments.record_type = 'SystemSettings'
          AND attachments.record_id = system_settings.id
          AND attachments.name = 'location_file'
          ORDER BY system_settings.id ASC
          LIMIT 1
        "
      ).first

      GenerateLocationFilesService.generate if !system_settings['has_locations_attachment'] && count_locations.positive?
    end
  rescue StandardError => e
    Rails.logger.error 'Locations options not generated'
    Rails.logger.error e.message
  end
end

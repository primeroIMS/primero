# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Generates a JSON file of all Location objects.
# Often, this will be too big to be served via the API.
class GenerateLocationFilesService
  class << self
    def generate
      write_locations_to_file
    end

    private

    def write_locations_to_file
      locations_data_json = Location.connection.select_all(
        "SELECT json_build_object('data', COALESCE(json_agg(loc), '[]'::json)) " \
        'FROM (SELECT id, location_code AS code, type, admin_level, name_i18n AS name, disabled FROM locations) loc'
      )

      SystemSettings.current.location_file.attach(
        io: StringIO.new(locations_data_json[0]['json_build_object']), filename: 'locations.json'
      )
      SystemSettings.current.save!
    end
  end
end

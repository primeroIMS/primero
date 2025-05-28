# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter loc:field_name[0]=value into a sql query
class SearchFilters::LocationList < SearchFilters::ValueList
  include SearchFilters::Location

  # rubocop:disable Metrics/MethodLength
  def json_path_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          (
            data->>:field_name IS NOT NULL AND EXISTS
            (
              SELECT
                1
              FROM locations AS descendants
              WHERE descendants.admin_level >= :admin_level
              AND data->:field_name ? descendants.location_code
              AND EXISTS (
                SELECT 1 FROM locations
                WHERE locations.admin_level >= :admin_level
                AND locations.hierarchy_path @> descendants.hierarchy_path
                AND locations.location_code IN (:values)
              )
            )
          )
        ),
        { field_name: record_field_name, values: values.map { |value| value.to_s.upcase }, admin_level: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/MethodLength
  def searchable_query(record_class)
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          EXISTS (
            SELECT
              1
            FROM locations AS descendants
            WHERE descendants.admin_level >= :admin_level
            AND #{filter_record_location(record_class)}
            AND EXISTS (
              SELECT 1 FROM locations
              WHERE locations.admin_level >= :admin_level
              AND locations.hierarchy_path @> descendants.hierarchy_path
              AND locations.location_code IN (:values)
            )
          )
        ),
        { values: values.map { |value| value.to_s.upcase }, admin_level: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength
end

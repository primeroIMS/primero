# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter loc:field_name=value into a sql query
class SearchFilters::LocationList < SearchFilters::ValueList
  # rubocop:disable Metrics/MethodLength
  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          (
            data ? :field_name AND data->>:field_name IS NOT NULL AND EXISTS
            (
              SELECT
                1
              FROM locations
              INNER JOIN locations AS descendants
              ON locations.admin_level <= descendants.admin_level
                AND locations.hierarchy_path @> descendants.hierarchy_path
              WHERE locations.location_code IN (:values) AND (
                (JSONB_TYPEOF(data->:field_name) = 'array' AND data->:field_name ? descendants.location_code) OR (
                  JSONB_TYPEOF(data->:field_name) != 'array' AND descendants.location_code = data->>:field_name
                )
              )
            )
          )
        ),
        { field_name: field_name.gsub('loc:', ''), values: values.map { |value| value.to_s.upcase } }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength
end

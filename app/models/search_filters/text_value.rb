# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value into a sql query
class SearchFilters::TextValue < SearchFilters::Value
  def query
    return text_query unless location_filter

    location_query
  end

  # rubocop:disable Metrics/MethodLength
  def text_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          (
            data ? :field_name AND data->>:field_name IS NOT NULL AND
            (
              JSONB_TYPEOF(data->:field_name) = 'array' AND EXISTS (
                SELECT 1 FROM JSONB_ARRAY_ELEMENTS_TEXT(data->:field_name) AS array_field
                WHERE array_field IS NOT NULL AND array_field = :value
              ) OR (
              JSONB_TYPEOF(data->:field_name) != 'array' AND data->>:field_name = :value
              )
            )
          )
        ),
        { field_name:, value: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  # rubocop:disable Metrics/MethodLength
  def location_query
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
              WHERE locations.location_code = :value AND (
                (JSONB_TYPEOF(data->:field_name) = 'array' AND data->'field_name' ? descendants.location_code) OR (
                  JSONB_TYPEOF(data->:field_name) != 'array' AND descendants.location_code = data->>:field_name
                )
              )
            )
          )
        ),
        { field_name:, value: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength
end

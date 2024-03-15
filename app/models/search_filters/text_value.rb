# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value into a sql query
class SearchFilters::TextValue < SearchFilters::Value
  # rubocop:disable Metrics/MethodLength
  def query
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
end

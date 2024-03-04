# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform a boolean query parameter field_name=false into a sql query
class SearchFilters::BooleanValue < SearchFilters::Value
  # rubocop:disable Metrics/MethodLength
  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          (
            data ? :field_name AND
            (
               JSONB_TYPEOF(data->:field_name) = 'array' AND EXISTS (
                 SELECT 1 FROM JSONB_ARRAY_ELEMENTS_TEXT(data->:field_name) AS array_field
                 WHERE CAST(COALESCE(array_field, 'false') as boolean) = :value
              ) OR (
               JSONB_TYPEOF(data->:field_name) != 'array'
                 AND CAST(COALESCE(data->>:field_name, 'false') AS BOOLEAN) = :value
              )
            )
          ) OR (
            NOT data ? :field_name AND FALSE = :value
          )
        ),
        { field_name:, value: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength
end

# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=false,true,... into a SQL query
class SearchFilters::BooleanList < SearchFilters::ValueList
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
                 WHERE TO_JSONB(CAST(COALESCE(array_field, 'false') as boolean)) <@ JSONB_BUILD_ARRAY(:values)
              ) OR (
               JSONB_TYPEOF(data->:field_name) != 'array'
                 AND TO_JSONB(CAST(COALESCE(data->>:field_name, 'false') AS BOOLEAN)) <@ JSONB_BUILD_ARRAY(:values)
              )
            )
          ) OR (
            NOT data ? :field_name AND TO_JSONB(FALSE) <@ JSONB_BUILD_ARRAY(:values)
          )
        ),
        { field_name:, values: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength
end

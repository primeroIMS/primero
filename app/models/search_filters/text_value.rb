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
            (
              JSONB_TYPEOF(#{@data_column_name}->:field_name) = 'array'
              AND EXISTS (
                  SELECT
                    1
                  FROM JSONB_ARRAY_ELEMENTS_TEXT(#{@data_column_name}->:field_name) AS array_field
                  WHERE array_field #{@safe_operator} :value
              )
            ) OR (
               JSONB_TYPEOF(#{@data_column_name}->:field_name) != 'array'
               AND #{@data_column_name}->>:field_name #{@safe_operator} :value
             )
          )
        ),
        { field_name:, value: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength
end

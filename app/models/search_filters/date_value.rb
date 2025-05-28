# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value into a sql query
class SearchFilters::DateValue < SearchFilters::Value
  attr_accessor :date_include_time

  # rubocop:disable Metrics/MethodLength
  def json_path_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          data->>:field_name IS NOT NULL AND EXISTS (
            SELECT 1 FROM JSONB_ARRAY_ELEMENTS_TEXT(data->:field_name || CAST('[]' AS JSONB)) AS date_field
            WHERE TO_TIMESTAMP(date_field, :date_format) #{@safe_operator} TO_TIMESTAMP(:value, :date_format)
          )
        ),
        { field_name:, value: value.iso8601, date_format: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  def date_format
    date_include_time? ? Report::DATE_TIME_FORMAT : Report::DATE_FORMAT
  end

  def date_include_time?
    date_include_time || value.is_a?(Time)
  end

  def search_column_query
    ActiveRecord::Base.sanitize_sql_for_conditions(["#{safe_search_column} = ?", value])
  end
end

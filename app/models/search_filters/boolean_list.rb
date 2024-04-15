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
            data->>:field_name IS NOT NULL AND (#{values_query})
          ) OR (
            data->>:field_name IS NULL AND FALSE IN (:values)
          )
        ),
        { field_name:, values: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength
end

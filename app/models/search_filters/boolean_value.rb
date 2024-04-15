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
            data->>:field_name IS NOT NULL AND data->:field_name @> TO_JSONB(:value)
          ) OR (
            data->>:field_name IS NULL AND FALSE = :value
          )
        ),
        { field_name:, value: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength
end

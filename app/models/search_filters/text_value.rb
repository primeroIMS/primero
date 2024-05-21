# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value into a sql query
class SearchFilters::TextValue < SearchFilters::Value
  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      ['data->>:field_name IS NOT NULL AND data->:field_name ? :value', { field_name:, value: }]
    )
  end
end
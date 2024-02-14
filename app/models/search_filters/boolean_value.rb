# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value into a sql query
class SearchFilters::BooleanValue < SearchFilters::Value
  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      ["CAST(#{@data_column_name} ->> :field_name AS BOOLEAN) = :value", { field_name:, value: }]
    )
  end
end

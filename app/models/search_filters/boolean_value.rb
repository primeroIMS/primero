# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform a boolean query parameter field_name=false into a sql query
class SearchFilters::BooleanValue < SearchFilters::Value
  def query
    return query_for_boolean if value

    "(#{query_for_boolean} OR #{ActiveRecord::Base.sanitize_sql_for_conditions(['(data->>? IS NULL)', field_name])})"
  end

  def query_for_boolean
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "(data->>:field_name IS NOT NULL AND (#{json_path_query} OR data->:field_name ? :value))",
        { field_name:, value: value.to_s }
      ]
    )
  end
end

# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=false,true,... into a SQL query
class SearchFilters::BooleanList < SearchFilters::ValueList
  def json_path_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "(#{super}) OR (data->>:field_name IS NULL AND (array[false, 'false'] @> array[:values]))",
        { field_name:, values: }
      ]
    )
  end

  def json_path_predicate
    values.map do |value|
      ActiveRecord::Base.sanitize_sql_for_conditions(['@ == %s || @ == "%s"', value, value])
    end.join(' || ')
  end
end

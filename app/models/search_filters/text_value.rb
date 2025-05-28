# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value into a sql query
class SearchFilters::TextValue < SearchFilters::Value
  def json_path_predicate
    ActiveRecord::Base.sanitize_sql_for_conditions(['@ == "%s"', value])
  end

  def searchable_predicate(record_class)
    return super unless array_field?(record_class)

    "#{safe_search_column} && ARRAY[?]::VARCHAR[]"
  end
end

# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value into a sql query
class SearchFilters::TextValue < SearchFilters::Value
  def query
    json_path_query
  end

  def json_path_value
    ActiveRecord::Base.sanitize_sql_for_conditions(['@ == "%s"', value])
  end
end

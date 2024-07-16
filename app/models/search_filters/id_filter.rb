# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter id=value into a sql query
class SearchFilters::IdFilter < SearchFilters::Value
  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(['id = :value', { value: }])
  end
end

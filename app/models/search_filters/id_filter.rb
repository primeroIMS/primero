# frozen_string_literal: true

# Transform API query parameter id=value into a sql query
class SearchFilters::IdFilter < SearchFilters::Value
  def json_path_query
    ActiveRecord::Base.sanitize_sql_for_conditions(['id = :value', { value: }])
  end
end

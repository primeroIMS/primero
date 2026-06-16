# frozen_string_literal: true

# Transform API query parameter id=value1,value1 into a sql query
class SearchFilters::IdListFilter < SearchFilters::ValueList
  def json_path_query
    ActiveRecord::Base.sanitize_sql_for_conditions(['id IN (:values)', { values: }])
  end
end

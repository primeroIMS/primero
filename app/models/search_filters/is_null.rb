# frozen_string_literal: true

# Transform a null query parameter field_name=is_null into a sql query
class SearchFilters::IsNull < SearchFilters::SearchFilter
  def json_path_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "(data->>:field_name IS NULL OR data->>:field_name = '[]')", { field_name: }
      ]
    )
  end

  def searchable_query(record_class)
    return "#{safe_search_column} IS NULL" unless array_field?(record_class)

    "#{safe_search_column} IS NULL OR CARDINALITY(#{safe_search_column}) = 0"
  end

  def to_s
    "#{field_name}=is_null"
  end
end

# frozen_string_literal: true

# Transform a not null query parameter field_name=not_null into a sql query
class SearchFilters::NotNull < SearchFilters::SearchFilter
  def json_path_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      ["(data->>:field_name IS NOT NULL AND NOT data->>:field_name = '[]')", { field_name: }]
    )
  end

  def searchable_query(record_class)
    return "#{safe_search_column} IS NOT NULL" unless array_field?(record_class)

    "#{safe_search_column} IS NOT NULL AND CARDINALITY(#{safe_search_column}) > 0"
  end

  def to_s
    "#{field_name}=not_null"
  end
end

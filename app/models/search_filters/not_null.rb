# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform a not null query parameter field_name=not_null into a sql query
class SearchFilters::NotNull < SearchFilters::SearchFilter
  def json_path_query
    ActiveRecord::Base.sanitize_sql_for_conditions(['(data->>? IS NOT NULL)', field_name])
  end

  def searchable_query(_record_class)
    "#{safe_column} IS NOT NULL"
  end

  def to_s
    "#{field_name}=not_null"
  end
end

# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=false,true,... into a sql query
class SearchFilters::TextList < SearchFilters::ValueList
  def json_path_query
    return unless values.present?

    super
  end

  def json_path_predicate
    values.map do |value|
      ActiveRecord::Base.sanitize_sql_for_conditions(['@ == "%s"', value])
    end.join(' || ')
  end

  def searchable_predicate(record_class)
    return super unless array_field?(record_class)

    "#{safe_search_column} && ARRAY[?]::VARCHAR[]"
  end
end

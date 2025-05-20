# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=m..n into a sql query
class SearchFilters::NumericRange < SearchFilters::SearchFilter
  attr_accessor :from, :to

  def json_path_query
    return if from.blank? && to.blank?

    "(#{ActiveRecord::Base.sanitize_sql_for_conditions(['data->? IS NOT NULL', field_name])} AND #{super})"
  end

  def json_path_predicate
    return ActiveRecord::Base.sanitize_sql_for_conditions(['@ >= %s && @ <= %s', from, to]) if to.present?

    ActiveRecord::Base.sanitize_sql_for_conditions(['@ >= %s', from])
  end

  def searchable_query(record_class)
    return searchable_array_query if array_field?(record_class)

    ActiveRecord::Base.sanitize_sql_for_conditions(
      ["#{safe_search_column} IS NOT NULL AND #{safe_search_column} >= ? AND #{safe_search_column} <= ?", from, to]
    )
  end

  # We are not using this at the moment, but it could be useful when doing aggregates for age groupings
  def searchable_array_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      ["#{safe_search_column} IS NOT NULL AND INT4RANGE(?, ?, '[]') @> ANY(#{safe_search_column})", from, to]
    )
  end

  def to_h
    {
      type: 'numeric_range',
      field_name:,
      value: {
        from:,
        to:
      }
    }
  end

  def to_s
    "#{field_name}=#{from}..#{to}"
  end
end

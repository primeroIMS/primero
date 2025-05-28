# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value into a sql query
class SearchFilters::Value < SearchFilters::SearchFilter
  attr_accessor :value

  def json_path_query
    "#{safe_json_column} @? '#{json_field_query} ? (#{json_path_predicate})'"
  end

  def json_path_predicate
    # TODO: Remove @safe_operator?
    operator = @safe_operator == '=' ? '==' : @safe_operator
    ActiveRecord::Base.sanitize_sql_for_conditions(['@ %s %s', operator, value])
  end

  def searchable_query(record_class)
    ActiveRecord::Base.sanitize_sql_for_conditions([searchable_predicate(record_class), value])
  end

  def searchable_predicate(record_class)
    return "#{safe_search_column} IS NOT NULL AND #{safe_search_column} = ?" unless array_field?(record_class)

    "#{safe_search_column} IS NOT NULL AND #{safe_search_column} && array[?]"
  end

  def as_location_filter(record_class)
    return self unless location_field_filter?(record_class)

    clone.tap do |f|
      f.field_name = location_field_name_solr(field_name, value)
    end
  end

  def location_field_filter?(record_class)
    record_class.searchable_location_fields.include?(field_name)
  end

  def as_id_filter(record_class)
    return self unless id_field_filter?(record_class)

    clone.tap do |f|
      f.field_name = "#{field_name}_filterable"
    end
  end

  def to_h
    {
      type: 'value',
      field_name:,
      value:
    }
  end

  def to_s
    "#{field_name}=#{value}"
  end
end

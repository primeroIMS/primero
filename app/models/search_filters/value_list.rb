# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value1,value2,... into a sql query
class SearchFilters::ValueList < SearchFilters::SearchFilter
  attr_accessor :values

  def json_path_query
    return unless values.present?

    "#{safe_json_column} @? '#{json_field_query} ? (#{json_path_predicate})'"
  end

  def json_path_predicate
    values.map do |value|
      ActiveRecord::Base.sanitize_sql_for_conditions(['@ == %s', value])
    end.join(' || ')
  end

  def searchable_query(record_class)
    return unless values.present?

    ActiveRecord::Base.sanitize_sql_for_conditions([searchable_predicate(record_class), values])
  end

  def searchable_predicate(record_class)
    return "#{safe_search_column} IS NOT NULL AND #{safe_search_column} IN (?)" unless array_field?(record_class)

    "#{safe_search_column} IS NOT NULL AND #{safe_search_column} && array[?]"
  end

  def as_location_filter(record_class)
    return self unless location_field_filter?(record_class)

    location_filters = values.map do |value|
      SearchFilters::Value.new(
        field_name: location_field_name_solr(field_name, value), value:
      )
    end
    SearchFilters::Or.new(filters: location_filters)
  end

  def location_field_filter?(record_class)
    record_class.searchable_location_fields.include?(field_name)
  end

  def as_id_filter(record_class)
    return self unless id_field_filter?(record_class)

    id_filters = values.map { |value| SearchFilters::Value.new(field_name: "#{field_name}_filterable", value:) }

    SearchFilters::Or.new(filters: id_filters)
  end

  def to_h
    {
      type: 'values',
      field_name:,
      value: values
    }
  end

  def to_s
    "#{field_name}=#{values&.join(',')}"
  end
end

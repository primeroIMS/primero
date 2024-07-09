# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value into a Sunspot query
class SearchFilters::Value < SearchFilters::SearchFilter
  attr_accessor :value

  def query
    "(#{ActiveRecord::Base.sanitize_sql_for_conditions(['data->>? IS NOT NULL', field_name])} AND #{json_path_query})"
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
    return "#{field_name}=#{value}" unless not_filter

    "not[#{field_name}]=#{value}"
  end
end

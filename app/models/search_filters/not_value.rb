# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter not[field_name]=value into a Sunspot query
# TODO Delete once exporters are migrated to use SQL
class SearchFilters::NotValue < SearchFilters::SearchFilter
  attr_accessor :field_name, :values

  def as_location_filter(record_class)
    return self unless location_field_filter?(record_class)

    clone do |f|
      f.field_name = location_field_name_solr(field_name, values)
    end
  end

  def location_field_filter?(record_class)
    record_class.searchable_location_fields.include?(field_name)
  end

  def to_h
    {
      type: 'not',
      field_name:,
      value: values
    }
  end

  def to_s
    "not[#{field_name}]=#{values&.join(',')}"
  end
end

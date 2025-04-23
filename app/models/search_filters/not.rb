# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter not[field_name1]=value into a SQL query
class SearchFilters::Not < SearchFilters::SearchFilter
  attr_accessor :filter

  def query(record_class = nil)
    "NOT (#{filter.query(record_class)})"
  end

  def to_h
    filter.to_h.merge(type: 'not')
  end

  def to_s
    key, value = filter.to_s.split('=')
    "not[#{key}]=#{value}"
  end
end

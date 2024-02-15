# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value1,value2,... into a Sunspot query
class SearchFilters::RangeList < SearchFilters::ValueList
  attr_accessor :range_type

  def query
    range_queries = values.map { |value| range_type.new(field_name:, from: value['from'], to: value['to']).query }

    "(#{range_queries.join(' OR ')})"
  end
end

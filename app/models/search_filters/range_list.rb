# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name[0]=1..10,... into a sql query
class SearchFilters::RangeList < SearchFilters::ValueList
  def query(record_class = nil)
    klass = SearchFilterService.range_class(values.first)
    ranges = values.map { |value| klass.new(field_name:, from: value['from'], to: value['to']) }

    "(#{ranges.map { |range| range.query(record_class) }.join(' OR ')})"
  end
end

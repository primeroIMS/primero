# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter loc:field_name[0]=value into a sql query
class SearchFilters::LocationList < SearchFilters::ValueList
  include SearchFilters::Location

  def value_query
    'IN (:values)'
  end

  def query_conditions
    { field_name: record_field_name, values: values.map { |value| value.to_s.upcase } }
  end
end

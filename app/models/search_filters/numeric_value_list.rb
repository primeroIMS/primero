# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value1,value2,... into a sql query
class SearchFilters::NumericValueList < SearchFilters::ValueList
  attr_accessor :field_name, :values

  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      ["CAST(#{@data_column_name} ->> :field_name AS INTEGER) IN (:values)", { field_name:, values: }]
    )
  end
end

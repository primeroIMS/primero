# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=value into a sql query
class SearchFilters::DateValue < SearchFilters::Value
  attr_accessor :date_include_time

  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          to_timestamp(#{@data_column_name} ->> :field_name, :date_format)
          #{@operator}
          to_timestamp(:value, :date_format)
        ),
        { field_name:, value:, date_format: }
      ]
    )
  end

  def date_format
    date_include_time ? Report::DATE_TIME_FORMAT : Report::DATE_FORMAT
  end
end

# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=false,true,... into a SQL query
class SearchFilters::TextList < SearchFilters::ValueList
  def values_query
    values.map do |value|
      ActiveRecord::Base.sanitize_sql_for_conditions(
        ['data->:field_name ? :value', { field_name:, value: }]
      )
    end.join(' OR ')
  end
end

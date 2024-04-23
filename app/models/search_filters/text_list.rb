# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=false,true,... into a SQL query
class SearchFilters::TextList < SearchFilters::ValueList
  def query
    return unless values.present?

    "(#{ActiveRecord::Base.sanitize_sql_for_conditions(['data->>? IS NOT NULL', field_name])} AND (#{values_query}))"
  end

  def values_query
    values.map do |value|
      ActiveRecord::Base.sanitize_sql_for_conditions(['data->:field_name ? :value', { field_name:, value: }])
    end.join(' OR ')
  end
end

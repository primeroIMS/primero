# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=false,true,... into a SQL query
class SearchFilters::TextList < SearchFilters::ValueList
  def query
    return unless values.present?

    json_path_query
  end

  def json_path_value
    values.map do |value|
      ActiveRecord::Base.sanitize_sql_for_conditions(['@ == "%s"', value])
    end.join(' || ')
  end
end

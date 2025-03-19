# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=m..n into a Sunspot query
class SearchFilters::NumericRange < SearchFilters::SearchFilter
  attr_accessor :from, :to

  def query
    return if from.blank? && to.blank?

    "(#{ActiveRecord::Base.sanitize_sql_for_conditions(['data->? IS NOT NULL', field_name])} AND #{json_path_query})"
  end

  def json_path_value
    return ActiveRecord::Base.sanitize_sql_for_conditions(['@ >= %s && @ <= %s', from, to]) if to.present?

    ActiveRecord::Base.sanitize_sql_for_conditions(['@ >= %s', from])
  end

  def to_h
    {
      type: 'numeric_range',
      field_name:,
      value: {
        from:,
        to:
      }
    }
  end

  def to_s
    "#{field_name}=#{from}..#{to}"
  end
end

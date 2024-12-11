# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Represents a query against a field
class Reports::FieldQueries::FieldQuery < ValueObject
  # TODO: This constants are not used.
  DATE_FORMAT = 'YYYY-MM-DD'
  DATE_TIME_FORMAT = "YYYY-MM-DD'T'HH:MI:SS"

  attr_accessor :field, :record_field_name

  def to_sql
    return multi_select_query if field.multi_select?

    default_query
  end

  def default_query
    ActiveRecord::Base.sanitize_sql_array(
      ["COALESCE(%s ->> '%s', 'incomplete_data') AS %s", data_column_name, field.name, column_name]
    )
  end

  def data_column_name
    record_field_name || 'data'
  end

  def column_name(suffix = '')
    name = suffix.present? ? "#{field.name}_#{suffix}" : field.name
    return "#{record_field_name}_#{name}" if record_field_name.present?

    name
  end

  def sort_field
    column_name
  end

  def multi_select_query
    ActiveRecord::Base.sanitize_sql_array(
      ["jsonb_array_elements_text(%s-> '%s') as %s", data_column_name, field.name, column_name]
    )
  end
end

# frozen_string_literal: true

# Represents a query against a field
class Reports::FieldQueries::FieldQuery < ValueObject
  DATE_FORMAT = 'YYYY-MM-DD'
  DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:MI:SS'

  attr_accessor :field, :record_field_name

  def to_sql
    return multi_select_query if field.multi_select?

    default_query
  end

  def default_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "COALESCE(#{data_column_name} ->> :field_name, 'incomplete_data') AS #{column_name}", { field_name: field.name }
      ]
    )
  end

  def data_column_name
    ActiveRecord::Base.connection.quote_column_name(record_field_name || 'data')
  end

  def column_name(suffix = '')
    name = suffix.present? ? "#{field.name}_#{suffix}" : field.name
    ActiveRecord::Base.connection.quote_column_name(record_field_name.present? ? "#{record_field_name}_#{name}" : name)
  end

  def sort_field
    column_name
  end

  def multi_select_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        "jsonb_array_elements_text(#{data_column_name}-> :field_name) as #{column_name}", { field_name: field.name }
      ]
    )
  end
end

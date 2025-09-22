# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Represents a query against a field
class Reports::FieldQueries::FieldQuery < ValueObject
  PG_MAX_IDENTIFIER_LENGTH = 62

  attr_accessor :field, :record_field_name, :field_identifier, :column_alias, :sort_alias

  def initialize(args = {})
    super(args)

    self.field_identifier = generate_field_identifier
    self.column_alias = truncate_identifer(generate_column_alias)
    self.sort_alias = truncate_identifer(generate_sort_alias)
  end

  def to_sql
    return multi_select_query if field.multi_select?

    default_query
  end

  def default_query
    ActiveRecord::Base.sanitize_sql_array(
      ["COALESCE(%s ->> '%s', 'incomplete_data') AS %s", data_column_name, field.name, column_alias]
    )
  end

  def data_column_name
    record_field_name || 'data'
  end

  def generate_field_identifier
    "#{field.name.split('_').map(&:first).join}_#{SecureRandom.uuid.slice(0, 4)}"
  end

  def generate_column_alias
    return field_identifier unless record_field_name.present?

    "#{record_field_name}_#{field_identifier}"
  end

  def generate_sort_alias
    column_alias
  end

  def truncate_identifer(identifier)
    return identifier unless identifier.size > PG_MAX_IDENTIFIER_LENGTH

    identifier.slice(0, PG_MAX_IDENTIFIER_LENGTH)
  end

  def multi_select_query
    ActiveRecord::Base.sanitize_sql_array(
      ["jsonb_array_elements_text(%s-> '%s') as %s", data_column_name, field.name, column_alias]
    )
  end
end

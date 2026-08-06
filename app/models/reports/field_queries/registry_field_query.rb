# frozen_string_literal: true

# Represents a query against a registry field
class Reports::FieldQueries::RegistryFieldQuery < Reports::FieldQueries::FieldQuery
  attr_accessor :system_settings, :aliases

  def to_sql
    registry_fields_sql = collapsed_field_names.map do |field_name|
      ActiveRecord::Base.sanitize_sql_for_conditions(["%s.registry_data->>'%s'", join_alias, field_name])
    end.join(',')

    "CONCAT_WS(' - ', #{registry_fields_sql}) AS #{column_alias}"
  end

  def truncate_identifer(identifier)
    # Don't need to truncate identifiers as aliases are already trucanted by the RegistryJoinQuery
    identifier
  end

  def generate_column_alias
    aliases[:field]
  end

  def join_alias
    aliases[:join]
  end

  def collapsed_field_names
    collapsed_field_names = SystemSettings.current.registry_options&.dig(
      field.option_strings_source, 'collapsed_field_names'
    )
    return [] if collapsed_field_names.blank?

    collapsed_field_names
  end
end

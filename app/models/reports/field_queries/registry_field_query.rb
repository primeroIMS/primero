# frozen_string_literal: true

# Generates the SQL expression needed to display a registry-type field in
# report query results. Registry fields store references to RegistryRecord
# rows inside a JSONB colum. The registry records are brought
# into the query via the joins built by Reports::RegistryJoinQuery, and
# this class extracts the values from those joined rows.
#
# Registry fields are configured with collapsed_field_names in the SystemSettings,
# which causes multiple sub-fields to be part of the display value for a registry field.
# This query is concatenating those values but a different approach
# is needed for fields with configured lookups.
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

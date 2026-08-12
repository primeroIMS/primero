# frozen_string_literal: true

# Builds and applies the SQL joins required to fetch registry records from registry fields in report queries.
# Some records (e.g., Cases) store references to RegistryRecord rows inside json properties of a JSONB column.
# This class generates a lateral join against those references and adds the left joins
# needed to bring registry record data into the report query. Please note that each reference generates a left join.
# Although filtering or aggregating by registry record fields is not currently supported,
# these joins can be used for that purpose in the future.
#
#
# Usage example:
#
# registry_join_query = Reports::RegistryJoinQuery.new(
#   json_column: model.try(:parent_record_type).present? ? nested_model_alias : 'data',
#   registry_fields: pivot_fields.values.select { |field| field.type == Field::REGISTRY }.uniq(&:name)
# )
#
# query = model.try(:parent_record_type).present? ? join_nested_model : model
#
# query = registry_join_query.apply(query)
class Reports::RegistryJoinQuery < ValueObject
  attr_accessor :registry_fields, :json_column

  def apply(base_query)
    return base_query if registry_fields.blank?

    join_query = base_query.joins(lateral_values_join_sql)
    registry_fields.reduce(join_query) do |query, field|
      query.joins(registry_records_join_sql(field))
    end
  end

  # Returns a hash of generated aliases keyed by field name. These alias are referenced in the RegistryFieldQuery.
  # Each entry contains:
  # [select] - the column alias used in SELECT clauses
  # [value_id]  - the alias for the extracted UUID column in the lateral VALUES subquery
  # [join] - the alias used for the LEFT JOIN subquery
  def registry_aliases
    @registry_aliases ||= registry_fields.each_with_object({}) do |field, memo|
      memo[field.name] = {
        select: Reports::AliasGenerator.generate(field.name),
        value_id: Reports::AliasGenerator.generate(field.name, nil, 'id'),
        join: Reports::AliasGenerator.generate(field.name, 'registry_records')
      }
    end
  end

  private

  def lateral_values_join_sql
    value_ids_placeholders = registry_fields.length.times.map { |_| '%s' }
    lateral_sql = <<~SQL.squish
      CROSS JOIN LATERAL(
        VALUES (
          #{registry_fields.map { |field| registry_values_sql(field) }.join(',')}
        )
      ) AS associated_registries(#{value_ids_placeholders.join(',')})
    SQL
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [lateral_sql] + registry_aliases.values.map { |elem| elem[:value_id] }
    )
  end

  def registry_values_sql(field)
    ActiveRecord::Base.sanitize_sql_for_conditions(
      ["CAST(%s->>'%s' AS UUID)", json_column, field.name]
    )
  end

  def registry_records_join_sql(field)
    join_sql = <<~SQL.squish
      LEFT JOIN (
        SELECT id AS registry_id, data as registry_data
        FROM registry_records
      ) %s
      ON %s.registry_id = associated_registries.%s
    SQL

    join_alias = registry_aliases.dig(field.name, :join)
    value_alias = registry_aliases.dig(field.name, :value_id)
    ActiveRecord::Base.sanitize_sql_for_conditions([join_sql, join_alias, join_alias, value_alias])
  end
end

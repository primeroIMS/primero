# frozen_string_literal: true

# Applies the registry-record joins required by report registry pivots.
class Reports::RegistryJoinQuery < ValueObject
  attr_accessor :registry_fields, :json_column

  def apply(base_query)
    return base_query if registry_fields.blank?

    join_query = base_query.joins(lateral_values_join_sql)
    registry_fields.reduce(join_query) do |query, field|
      query.joins(registry_records_join_sql(field))
    end
  end

  def registry_aliases
    @registry_aliases ||= registry_fields.each_with_object({}) do |field, memo|
      memo[field.name] = {
        field: Reports::AliasGenerator.generate(field.name),
        value_id: Reports::AliasGenerator.generate(field.name, nil, 'id'),
        join: Reports::AliasGenerator.generate(field.name, 'registry_records')
      }
    end
  end

  private

  def lateral_values_join_sql
    pivots_placeholders = registry_fields.length.times.map { |_| '%s' }
    lateral_sql = <<~SQL.squish
      CROSS JOIN LATERAL(
        VALUES (
          #{registry_fields.map { |field| registry_values_sql(field) }.join(',')}
        )
      ) AS associated_registries(#{pivots_placeholders.join(',')})
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

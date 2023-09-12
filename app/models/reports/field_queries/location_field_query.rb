# frozen_string_literal: true

# Represents a query against a location field
class Reports::FieldQueries::LocationFieldQuery < Reports::FieldQueries::FieldQuery
  attr_accessor :admin_level

  # rubocop:disable Metrics/MethodLength
  def to_sql
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          (
            select
              case when nlevel(hierarchy_path) > :admin_level then subpath(locations.hierarchy_path, :admin_level, 1)
              else null end
            from locations where location_code = #{data_column_name}->>:field_name
          ) as #{column_name}
        ),
        { field_name: field.name,
          admin_level: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  def column_name(_suffix = '')
    super(admin_level)
  end
end

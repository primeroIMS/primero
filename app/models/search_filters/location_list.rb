# frozen_string_literal: true

# Transform API query parameter loc:field_name[0]=value into a sql query
class SearchFilters::LocationList < SearchFilters::ValueList
  include SearchFilters::Location

  # rubocop:disable Metrics/MethodLength
  def json_path_query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          (
            #{location_present_predicate} AND EXISTS
            (
              SELECT
                1
              FROM locations AS descendants
              WHERE descendants.admin_level >= :admin_level
              AND #{location_matches_descendant_predicate}
              AND EXISTS (
                SELECT 1 FROM locations
                WHERE locations.admin_level >= :admin_level
                AND locations.hierarchy_path @> descendants.hierarchy_path
                AND locations.location_code IN (:values)
              )
            )
          )
        ),
        { field_name: column_name || record_field_name, values: values.map do |value|
          value.to_s.upcase
        end, admin_level: admin_level }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  def location_present_predicate
    return "#{safe_location_column} IS NOT NULL" if column_name.present?

    "#{safe_json_column}->>:field_name IS NOT NULL"
  end

  def location_matches_descendant_predicate
    return "#{safe_location_column} = descendants.location_code" if column_name.present?

    "#{safe_json_column}->:field_name ? descendants.location_code"
  end

  def safe_location_column
    quoted_column = ActiveRecord::Base.connection.quote_column_name(column_name)
    return quoted_column unless table_name.present?

    quoted_table = ActiveRecord::Base.connection.quote_table_name(table_name)
    "#{quoted_table}.#{quoted_column}"
  end

  # rubocop:disable Metrics/MethodLength
  def searchable_query(record_class)
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          EXISTS (
            SELECT
              1
            FROM locations AS descendants
            WHERE descendants.admin_level >= :admin_level
            AND #{filter_record_location(record_class)}
            AND EXISTS (
              SELECT 1 FROM locations
              WHERE locations.admin_level >= :admin_level
              AND locations.hierarchy_path @> descendants.hierarchy_path
              AND locations.location_code IN (:values)
            )
          )
        ),
        { values: values.map { |value| value.to_s.upcase }, admin_level: }
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength
end

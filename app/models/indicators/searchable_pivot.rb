# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class Indicators::SearchablePivot < Indicators::IndicatorPivot
  attr_accessor :searchable_column_name

  def select
    return ActiveRecord::Base.sanitize_sql_array(['pivot?', number]) if multivalue?
    return select_location_pivot if location?

    ActiveRecord::Base.sanitize_sql_array(["#{safe_column_name} AS pivot?", number])
  end

  def select_location_pivot
    ActiveRecord::Base.sanitize_sql_array(
      [%(reporting_locations.reporting_location_code AS pivot:number), { number: }]
    )
  end

  # rubocop:disable Metrics/MethodLength
  def join_location_pivot(indicator_query)
    indicator_query.joins(
      ActiveRecord::Base.sanitize_sql_array(
        [
          %(CROSS JOIN LATERAL (
              SELECT
                LOWER(CAST(SUBPATH(locations.hierarchy_path, :admin_level, 1) AS VARCHAR)) AS reporting_location_code
              FROM locations WHERE location_code = #{safe_column_name} AND NLEVEL(hierarchy_path) > :admin_level
            ) AS reporting_locations
          ),
          { admin_level: }
        ]
      )
    )
  end
  # rubocop:enable Metrics/MethodLength

  def join_multivalue(indicator_query)
    indicator_query.joins(
      ActiveRecord::Base.sanitize_sql_array(["CROSS JOIN UNNEST(#{safe_column_name}) AS pivot?", number])
    )
  end

  def constraint_values(indicator_query, managed_user_names)
    if multivalue?
      return indicator_query.where(ActiveRecord::Base.sanitize_sql_array(['pivot? IN (?)', number, managed_user_names]))
    end

    indicator_query.where(
      ActiveRecord::Base.sanitize_sql_array(["#{safe_column_name} IN (?)", managed_user_names])
    )
  end

  def safe_column_name
    return unless searchable_column_name.present?

    ActiveRecord::Base.sanitize_sql_array(['%s', searchable_column_name])
  end
end

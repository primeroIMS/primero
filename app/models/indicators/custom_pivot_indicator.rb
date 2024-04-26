# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Class for CustomPivotedIndicator
  class CustomPivotIndicator < GroupedIndicator
    # rubocop:enable Style/ClassAndModuleChildren

    SELECT_LOCATION_PIVOT = %(
      (
        SELECT
          CASE WHEN NLEVEL(hierarchy_path) > :admin_level THEN
            LOWER(CAST(SUBPATH(locations.hierarchy_path, :admin_level, 1) AS VARCHAR))
          ELSE NULL END
        FROM locations WHERE location_code = data->>:field_name
      ) AS pivot:index
    )

    def select_pivots
      select = pivots.map.with_index(1) do |pivot, index|
        next(ActiveRecord::Base.sanitize_sql_array(['pivot?', index])) if pivot[:multivalue].present?

        if pivot[:type] == 'location'
          next(ActiveRecord::Base.sanitize_sql_array([SELECT_LOCATION_PIVOT, pivot.merge(index:)]))
        end

        ActiveRecord::Base.sanitize_sql_array(['data->>? AS pivot?', pivot[:field_name], index])
      end.join(', ')

      "#{select}, COUNT(*) AS count"
    end

    protected

    def join_and_constraint_pivots(indicator_query, managed_user_names)
      pivots.each.with_index(1) do |pivot, index|
        indicator_query = join_multivalued_pivot(indicator_query, pivot, index) if pivot[:multivalue].present?
        next unless constrained_pivots&.include?(pivot) && managed_user_names.present?

        indicator_query = constraint_pivot_values(indicator_query, pivot, index, managed_user_names)
      end

      indicator_query
    end

    def join_multivalued_pivot(indicator_query, pivot, index)
      indicator_query.joins(
        ActiveRecord::Base.sanitize_sql_array(
          ['CROSS JOIN JSONB_ARRAY_ELEMENTS_TEXT(data->?) AS pivot?', pivot[:field_name], index]
        )
      )
    end

    def constraint_pivot_values(indicator_query, pivot, index, managed_user_names)
      if pivot[:multivalue].present?
        return indicator_query.where(
          ActiveRecord::Base.sanitize_sql_array(['pivot? IN (?)', index, managed_user_names])
        )
      end

      indicator_query.where(
        ActiveRecord::Base.sanitize_sql_array(['data->>? IN (?)', pivot[:field_name], managed_user_names])
      )
    end

    def pivot_param(pivot)
      return pivot[:query_param] if pivot[:query_param].present?
      return "loc:#{pivot[:field_name]}" if pivot[:type] == 'location'

      pivot[:field_name]
    end
  end
end

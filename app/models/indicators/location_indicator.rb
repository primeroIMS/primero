# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Indicators
  # Class for LocationIndicator
  class LocationIndicator < AbstractIndicator
    attr_accessor :admin_level, :field_name

    def query(indicator_filters, user_query_scope)
      super(indicator_filters, user_query_scope).joins(locations_join)
                                                .group('ancestor_location_code')
                                                .select('ancestor_location_code, COUNT(*) AS count')
    end

    def write_stats_for_indicator(indicator_filters, user_query_scope)
      indicator_query = query(indicator_filters, user_query_scope)
      result = Child.connection.select_all(indicator_query.to_sql).to_a
      result.each_with_object({}) do |row, memo|
        memo[row['ancestor_location_code']] = stats_for_pivots(row, indicator_filters)
      end
    end

    def stats_for_pivots(row, indicator_filters)
      { 'count' => row['count'], 'query' => stat_query_strings(row, indicator_filters) }
    end

    def stat_query_strings(row, indicator_filters)
      indicator_filters.map(&:to_s) + ["loc:#{field_name}=#{row['ancestor_location_code']}"]
    end

    # rubocop:disable Metrics/MethodLength
    def locations_join
      ActiveRecord::Base.sanitize_sql_array(
        [
          %(
            INNER JOIN (
              SELECT
                ancestors.location_code AS ancestor_location_code,
                descendants.location_code AS descendant_location_code
              FROM locations AS ancestors
              INNER JOIN locations AS descendants
              ON ancestors.admin_level <= descendants.admin_level
              AND ancestors.hierarchy_path @> descendants.hierarchy_path
              AND ancestors.admin_level  = :admin_level
            ) AS reporting_locations
            ON reporting_locations.descendant_location_code = data->>:field_name
          ),
          { admin_level:, field_name: }
        ]
      )
    end
    # rubocop:enable Metrics/MethodLength
  end
end
# rubocop:enable Style/ClassAndModuleChildren

# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern for location filters
module SearchFilters::Location
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/MethodLength
  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        %(
          (
            data->>:field_name IS NOT NULL AND EXISTS
            (
              SELECT
                1
              FROM locations
              INNER JOIN locations AS descendants
              ON locations.admin_level <= descendants.admin_level
                AND locations.hierarchy_path @> descendants.hierarchy_path
              WHERE locations.location_code #{value_query} AND data->:field_name ? descendants.location_code
            )
          )
        ),
        query_conditions
      ]
    )
  end
  # rubocop:enable Metrics/MethodLength

  def value_query
    '= :value'
  end

  def query_conditions
    { field_name: record_field_name, value: value.to_s.upcase }
  end

  def record_field_name
    field_name.gsub(/^loc:/, '')
  end
end

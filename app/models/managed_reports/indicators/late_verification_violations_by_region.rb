# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# An indicator that returns the violations late verified by region
class ManagedReports::Indicators::LateVerificationViolationsByRegion < ManagedReports::SqlReportIndicator
  include ManagedReports::GhnIndicatorHelper

  class << self
    def id
      'late_verification_violations_by_region'
    end

    def sql(current_user, params = {})
      <<~SQL
        WITH violations_in_scope AS (
          SELECT
            violations.id,
            violations.data->>'type' AS type,
            #{incident_region_query(current_user)} AS region,
            CASE WHEN #{filter_types(Violation::GRAVE_TYPES_FOR_VIOLATION_COUNT).query}
              THEN 1
              ELSE COALESCE(CAST(violations.data->'violation_tally'->'total' AS INTEGER), 0)
            END AS violation_tally_total
          FROM violations
          INNER JOIN incidents incidents ON incidents.id = violations.incident_id
            AND incidents.srch_status = 'open'
            AND incidents.srch_record_state = TRUE
            #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
            #{date_range_query(params['ghn_date_filter'], 'violations', 'data', 'ctfmr_verified_date')&.prepend('AND ')}
          WHERE violations.data @? '$[*] ? (@.is_late_verification == true)'
          AND #{filter_types(Violation::GRAVE_TYPES).query}
        )
        SELECT
          violations_in_scope.region as name,
          violations_in_scope.type AS key,
          CAST(SUM(violation_tally_total) AS INTEGER) AS sum,
          CAST(SUM(SUM(violation_tally_total)) OVER (PARTITION BY violations_in_scope.region) AS INTEGER) AS total
        FROM violations_in_scope
        GROUP BY name, key
      SQL
    end

    def group_by_victim?
      false
    end
  end
end

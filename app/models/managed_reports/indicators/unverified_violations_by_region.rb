# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# An indicator that returns the unverified violations by region
class ManagedReports::Indicators::UnverifiedViolationsByRegion < ManagedReports::SqlReportIndicator
  class << self
    def id
      'unverified_violations_by_region'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      %{
        WITH violations_in_scope AS (
          SELECT
            violations.id,
            violations.data->>'type' AS type,
            #{incident_region_query(current_user)} AS region
          FROM violations
          INNER JOIN incidents incidents
            ON incidents.id = violations.incident_id
            #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
            #{date_range_query(params['ghn_date_filter'], 'incidents', 'data', 'ctfmr_verified_date')&.prepend('AND ')}
          WHERE violations.data @? '$[*] ? (@.ctfmr_verified == "report_pending_verification")'
          AND violations.data @? '$.type ? (
            @ == "attack_on_hospitals" || @ == "attack_on_schools" || @ == "denial_humanitarian_access"
          )'
        )
        SELECT
          violations_in_scope.region as name,
          violations_in_scope.type AS key,
          COUNT(*) AS sum,
          CAST(SUM(COUNT(*)) OVER () AS INTEGER) AS total
        FROM violations_in_scope
        GROUP BY name, key
      }
    end
    # rubocop:enable Metrics/MethodLength
  end
end

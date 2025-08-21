# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# An indicator that returns the verified violations by region
class ManagedReports::Indicators::VerifiedViolationsByRegion < ManagedReports::SqlReportIndicator
  class << self
    def id
      'verified_violations_by_region'
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
          WHERE violations.data @? '$[*] ? (
            @.ctfmr_verified == "verified" && @.type != "denial_humanitarian_access" && @.is_late_verification != true
          )'
          #{date_range_query(params['ghn_date_filter'], 'violations', 'data', 'ctfmr_verified_date')&.prepend('AND ')}
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

# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# An indicator that returns the unverified violations by perpetrator
class ManagedReports::Indicators::UnverifiedViolationsByPerpetrator < ManagedReports::SqlReportIndicator
  class << self
    def id
      'unverified_violations_by_perpetrator'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      %{
        WITH violations_in_scope AS (
          SELECT
            violations.id,
            violations.data->>'type' AS type
          FROM violations
          INNER JOIN incidents incidents
            ON incidents.id = violations.incident_id
            #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
            #{date_range_query(params['ghn_date_filter'], 'incidents', 'data', 'incident_date')&.prepend('AND ')}
          WHERE violations.data @? '$.ctfmr_verified ? (@ == "report_pending_verification")'
        )
        SELECT
          perpetrators.data->>'armed_force_group_party_name' AS name,
          violations_in_scope.type AS key,
          COUNT(*) AS sum,
          CAST(SUM(COUNT(*)) OVER (PARTITION BY perpetrators.data->>'armed_force_group_party_name') AS INTEGER) AS total
        FROM violations_in_scope
        INNER JOIN perpetrators_violations ON perpetrators_violations.violation_id = violations_in_scope.id
        INNER JOIN perpetrators ON perpetrators.id = perpetrators_violations.perpetrator_id
        GROUP BY name, key
      }
    end
    # rubocop:enable Metrics/MethodLength
  end
end

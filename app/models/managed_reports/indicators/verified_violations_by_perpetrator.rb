# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# An indicator that returns the verified violations by perpetrator
class ManagedReports::Indicators::VerifiedViolationsByPerpetrator < ManagedReports::SqlReportIndicator
  class << self
    def id
      'verified_violations_by_perpetrator'
    end

    def sql(current_user, params = {})
      <<~SQL
        WITH violations_in_scope AS (
          SELECT
            violations.id,
            violations.data->>'type' AS type
          FROM violations
          INNER JOIN incidents incidents
            ON incidents.id = violations.incident_id
            AND incidents.srch_status = 'open'
            AND incidents.srch_record_state = TRUE
            #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
          WHERE violations.data @? '$[*] ? (@.ctfmr_verified == "verified" && @.is_late_verification != true)'
          #{date_range_query(params['ghn_date_filter'], 'violations', 'data', 'ctfmr_verified_date')&.prepend('AND ')}
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
      SQL
    end
  end
end

# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the type of use of violation type Recruitment
class ManagedReports::Indicators::MultipleViolations < ManagedReports::SqlReportIndicator
  include ManagedReports::GhnIndicatorHelper

  class << self
    def id
      'multiple_violations'
    end

    def sql(current_user, params = {})
      <<~SQL
        WITH verified_open_violations AS (
          SELECT
            violations.id AS violation_id,
            violations.data ->> 'type' AS violation_type,
            incidents.id AS incident_id,
            incidents.data->>'short_id' AS short_id
          FROM violations violations
          INNER JOIN incidents incidents
            ON incidents.id = violations.incident_id
            AND incidents.srch_status = 'open'
            AND incidents.srch_record_state = TRUE
            #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
          WHERE violations.data @? '$[*] ? (@.ctfmr_verified == "verified")'
          AND #{filter_types(Violation::GRAVE_TYPES).query}
          #{date_range_query(date_filter_param(params['ghn_date_filter']), 'violations')&.prepend('AND ')}
        )
        SELECT DISTINCT
          JSONB_BUILD_OBJECT(
            'unique_id', individual_victims.data->>'unique_id',
            'incident_id', verified_open_violations.incident_id,
            'incident_short_id', verified_open_violations.short_id,
            'individual_sex', individual_victims.data->>'individual_sex',
            'individual_age', individual_victims.data->>'individual_age',
            'violations', JSONB_AGG(verified_open_violations.violation_type)
          ) AS data
        FROM verified_open_violations
        INNER JOIN individual_victims_violations
          ON individual_victims_violations.violation_id = verified_open_violations.violation_id
        INNER JOIN individual_victims
          ON individual_victims.id = individual_victims_violations.individual_victim_id
        WHERE individual_victims.data @? '$[*] ? (@.individual_multiple_violations == true)'
        GROUP by individual_victims.id , verified_open_violations.incident_id, verified_open_violations.short_id
        HAVING COUNT(*) >= 2
      SQL
    end

    def build_results(results, _params = {})
      results_array = results.to_a

      results_array.map do |value|
        value['data'] = JSON.parse(value['data'])
      end

      results_array
    end
  end
end

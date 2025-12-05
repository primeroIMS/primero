# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns children affected by multiple violations as part of a group
class ManagedReports::Indicators::GroupMultipleViolations < ManagedReports::SqlReportIndicator
  include ManagedReports::GhnIndicatorHelper

  class << self
    def id
      'group_multiple_violations'
    end

    def sql(current_user, params = {})
      <<~SQL
        WITH verified_open_violations as (
          SELECT
            violations.id,
            violations.data->>'type' AS type,
            violations.incident_id,
            incidents.data->>'short_id' AS incident_short_id
          FROM violations
          INNER JOIN incidents incidents
            ON incidents.id = violations.incident_id
            AND incidents.srch_status = 'open'
            AND incidents.srch_record_state = TRUE
          WHERE violations.data @? '$[*]
            ? (@.ctfmr_verified == "verified")
            ? (@.type != "deprivation_liberty" && @.type != "military_use")
          '
          #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
          #{date_range_query(date_filter_param(params['ghn_date_filter']), 'violations')&.prepend('AND ')}
        )
        SELECT
          JSONB_BUILD_OBJECT(
            'unique_id', group_victims.data->>'unique_id',
            'incident_id', verified_open_violations.incident_id,
            'incident_short_id', verified_open_violations.incident_short_id,
            'group_gender', group_victims.data->>'group_gender',
            'group_age_band', group_victims.data->'group_age_band',
            'violations', JSONB_AGG(verified_open_violations.type)
          ) AS data
        FROM group_victims_violations
        INNER JOIN group_victims ON group_victims.id = group_victims_violations.group_victim_id
        INNER JOIN verified_open_violations ON verified_open_violations.id = group_victims_violations.violation_id
        WHERE group_victims.data @? '$[*] ? (@.group_multiple_violations == true)'
        -- NOTE: Group Victims and Violations are not shared between incidents --
        GROUP BY group_victim_id, group_victims.data, verified_open_violations.incident_id,
                 verified_open_violations.incident_short_id
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

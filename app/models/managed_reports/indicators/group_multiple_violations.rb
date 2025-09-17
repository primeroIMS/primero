# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns children affected by multiple violations as part of a group
class ManagedReports::Indicators::GroupMultipleViolations < ManagedReports::SqlReportIndicator
  include ManagedReports::GhnIndicatorHelper

  class << self
    def id
      'group_multiple_violations'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      %{
        SELECT DISTINCT
          jsonb_build_object(
            'unique_id', group_victims.data->>'unique_id',
            'incident_id', incidents.id,
            'incident_short_id', incidents.data->>'short_id',
            'group_gender', group_victims.data->>'group_gender',
            'group_age_band', group_victims.data->'group_age_band',
            'violations', jsonb_agg(violations.data ->> 'type')
          ) AS data
        FROM
          violations violations
          INNER JOIN incidents incidents ON incidents.id = violations.incident_id
          INNER JOIN group_victims_violations ON group_victims_violations.violation_id = violations.id
          INNER JOIN group_victims ON group_victims.id = group_victims_violations.group_victim_id
        WHERE group_victims.data @? '$[*] ? (@.group_multiple_violations == true)'
        AND violations.data @? '$[*] ? (@.ctfmr_verified == "verified")'
        #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        #{date_range_query(date_filter_param(params['ghn_date_filter']), 'violations')&.prepend('and ')}
        GROUP BY group_victims.id, incidents.id
        #{grouped_date_query(params['grouped_by'], filter_date(params), table_name_for_query(params))&.prepend(', ')}
      }
    end

    def build_results(results, _params = {})
      results_array = results.to_a

      results_array.map do |value|
        value['data'] = JSON.parse(value['data'])
      end

      results_array
    end

    # rubocop:enable Metrics/MethodLength
  end
end

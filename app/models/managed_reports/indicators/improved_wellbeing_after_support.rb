# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of clients with improved psychosocial wellbeing
class ManagedReports::Indicators::ImprovedWellbeingAfterSupport < ManagedReports::SqlReportIndicator
  include ManagedReports::PercentageIndicator
  class << self
    def id
      'improved_wellbeing_after_support'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      date_query = grouped_date_query(params['grouped_by'], date_param, 'searchable_datetimes', nil, 'value')
      group_id = date_query.present? ? 'group_id' : nil

      %{
        WITH improvement_ranges_and_groups AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            CASE WHEN (
              cases.data ->> 'psychsocial_assessment_score_most_recent'
            )::INT - (
              cases.data ->> 'psychsocial_assessment_score_initial'
            )::INT >= 3
            THEN 'improve_by_at_least_3_points'
            ELSE 'not_improve_by_at_least_3_points'
            END AS improvement_range,
            COALESCE(data->>'gender', 'incomplete_data') AS gender
          FROM cases
          #{ManagedReports::SearchableFilterService.filter_values(params['status'])}
          #{ManagedReports::SearchableFilterService.filter_datetimes(date_param)}
          #{ManagedReports::SearchableFilterService.filter_scope(current_user)}
          #{ManagedReports::SearchableFilterService.filter_next_steps}
          #{ManagedReports::SearchableFilterService.filter_consent_reporting}
          WHERE (
            cases.data @? '$[*]
              ? (@.psychsocial_assessment_score_initial >= 0)
              ? (@.psychsocial_assessment_score_most_recent >= 0)'
          )
        )
        SELECT
          #{group_id&.+(', ')}
          improvement_range,
          gender,
          COUNT(*)
        FROM improvement_ranges_and_groups
        GROUP BY #{group_id&.+(',')} improvement_range, gender
      }
    end
    # rubocop:enable Metrics/MethodLength

    alias super_build_results build_results
    def build_results(results, params = {})
      super_build_results(results_in_percentages(results.to_a), params)
    end

    def fields
      %w[gender improvement_range]
    end

    def result_map
      { 'key' => 'gender', 'name' => 'improvement_range' }
    end
  end
end

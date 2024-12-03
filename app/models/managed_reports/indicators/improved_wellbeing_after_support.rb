# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of clients with improved psychosocial wellbeing
class ManagedReports::Indicators::ImprovedWellbeingAfterSupport < ManagedReports::SqlReportIndicator
  class << self
    def id
      'improved_wellbeing_after_support'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      date_query = grouped_date_query(params['grouped_by'], date_param, 'searchable_datetimes', nil, 'value')
      group_id = date_query.present? ? 'group_id' : nil
      join_searchable_values = if params['status'].present?
                                 %(INNER JOIN searchable_values searchable_values
                                   ON cases.id = searchable_values.record_id
                                   AND searchable_values.record_type = 'Child')
                               end
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
            data->>'sex' AS sex
          FROM cases
          #{join_searchable_values}
          INNER JOIN searchable_datetimes searchable_datetimes ON cases.id = searchable_datetimes.record_id
          AND searchable_datetimes.record_type = 'Child'
          WHERE (cases.data @? '$.next_steps ? (@ == "a_continue_protection_assessment")')
          AND cases.data->>'psychsocial_assessment_score_initial' IS NOT NULL
          AND cases.data->>'psychsocial_assessment_score_most_recent' IS NOT NULL
          AND searchable_datetimes.field_name = 'registration_date'
          #{user_scope_query(current_user)&.prepend('AND ')}
          #{searchable_equal_value_multiple(params['status'])&.prepend('AND ')}
          #{searchable_date_range_query(date_param, 'searchable_datetimes', nil, 'value')&.prepend('AND ')}
        ),
        percentages AS (
          SELECT
            improvement_range,
            #{group_id&.+(', ')}
            sex,
            COUNT(*) * 100 / SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} sex) AS percentage,
            SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} improvement_range) AS total_improvement,
            SUM(COUNT(*)) OVER (#{group_id&.dup&.prepend('PARTITION BY ')}) AS total
          FROM improvement_ranges_and_groups
          GROUP BY #{group_id&.+(',')} improvement_range, sex
        )
        SELECT
          improvement_range AS name,
          sex AS key,
          #{group_id&.+(', ')}
          ROUND(percentage, 2) AS sum,
          ROUND((total_improvement * 100) / total, 2) AS total
        FROM percentages
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

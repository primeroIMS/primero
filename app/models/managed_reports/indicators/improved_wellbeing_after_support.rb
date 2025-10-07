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
      date_group_query = build_date_group(params, {}, Child)
      group_id = date_group_query.present? ? 'group_id' : nil
      %{
        WITH improvement_ranges_and_groups AS (
          SELECT
            #{date_group_query&.+(' AS group_id,')}
            CASE
              WHEN srch_psychsocial_assessment_score_most_recent - srch_psychsocial_assessment_score_initial >= 3
              THEN 'improve_by_at_least_3_points'
              ELSE 'not_improve_by_at_least_3_points'
            END AS improvement_range,
            COALESCE(srch_gender, 'incomplete_data') AS gender
          FROM cases
          WHERE srch_psychsocial_assessment_score_initial >= 0
          AND srch_psychsocial_assessment_score_most_recent >= 0
          AND srch_next_steps && '{a_continue_protection_assessment}'
          #{build_filter_query(current_user, params)&.prepend('AND ')}
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

    def build_filter_query(current_user, params = {})
      filters = [
        params['status'],
        ManagedReports::FilterService.to_datetime(filter_date(params)),
        ManagedReports::FilterService.consent_reporting,
        ManagedReports::FilterService.module_id(params['module_id']),
        ManagedReports::FilterService.scope(current_user)
      ].compact
      return unless filters.present?

      filters.map { |filter| filter.query(Child) }.join(' AND ')
    end

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

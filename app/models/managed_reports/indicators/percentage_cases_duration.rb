# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of cases by duration
class ManagedReports::Indicators::PercentageCasesDuration < ManagedReports::SqlReportIndicator
  include ManagedReports::PercentageIndicator

  class << self
    def id
      'percentage_cases_duration'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_group_query = build_date_group(params, {}, Child)
      group_id = date_group_query.present? ? 'group_id' : nil

      %(
        WITH protection_assessment_cases AS (
          SELECT
            #{date_group_query&.+(' AS group_id,')}
            cases.id AS id,
            COALESCE(srch_gender, 'incomplete_data') AS gender,
            #{duration_days_query}
          FROM cases
          WHERE srch_next_steps && '{a_continue_protection_assessment}'
          #{build_filter_query(current_user, params)&.prepend('AND ')}
        ),
        cases_with_duration_range AS (
          SELECT
            #{group_id&.+(',')}
            gender,
            CASE
              WHEN duration_days <= 30 THEN '1_month'
              WHEN duration_days > 30 AND duration_days <= 90 THEN '1_3_months'
              WHEN duration_days > 90 AND duration_days <= 180 THEN '3_6_months'
              WHEN duration_days > 180 THEN 'over_6_months'
            END AS duration_range
          FROM protection_assessment_cases
        )
        SELECT
          #{group_id&.+(',')}
          gender,
          duration_range,
          COUNT(*) AS count
        FROM cases_with_duration_range
        GROUP BY #{group_id&.+(',')} gender, duration_range
      )
    end

    # rubocop:enable Metrics/MethodLength
    def build_filter_query(current_user, params = {})
      filters = [
        params['status'],
        ManagedReports::FilterService.reporting_location(params['location']),
        ManagedReports::FilterService.to_datetime(filter_date(params)),
        ManagedReports::FilterService.consent_reporting,
        ManagedReports::FilterService.scope(current_user)
      ].compact
      return unless filters.present?

      filters.map { |filter| filter.query(Child) }.join(' AND ')
    end

    # rubocop:disable Metrics/MethodLength
    def duration_days_query
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
            CASE
              WHEN srch_status = 'open' THEN EXTRACT(DAY FROM :current_date - srch_registration_date)
              WHEN srch_status = 'closed' THEN EXTRACT(DAY FROM srch_date_closure - srch_registration_date)
            END AS duration_days
          ),
          { current_date: DateTime.now }
        ]
      )
    end
    # rubocop:enable Metrics/MethodLength

    alias super_build_results build_results
    def build_results(results, params = {})
      super_build_results(results_in_percentages(results.to_a), params)
    end

    def fields
      %w[gender duration_range]
    end

    def result_map
      { 'key' => 'gender', 'name' => 'duration_range' }
    end
  end
end

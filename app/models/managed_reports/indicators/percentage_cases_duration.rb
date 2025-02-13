# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of cases by duration
class ManagedReports::Indicators::PercentageCasesDuration < ManagedReports::SqlReportIndicator
  include ManagedReports::PercentageIndicator

  class << self
    def id
      'percentage_cases_duration'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      searchable_datetime_alias = date_param&.field_name == 'date_closure' ? 'closure_dates' : 'registration_dates'
      date_query = grouped_date_query(params['grouped_by'], date_param, searchable_datetime_alias, nil, 'value')
      group_id = date_query.present? ? 'group_id' : nil
      filter_opts = { table_name: 'sex_values', field_name: 'record_id' }
      status_filter_opts = filter_opts.merge(join_alias: 'statuses')
      next_step = 'a_continue_protection_assessment'

      %(
        WITH protection_assessment_cases AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            next_steps.record_id,
            sex_values.value AS sex,
            #{duration_days_query}
          FROM searchable_values AS sex_values
          #{join_searchable_closure_dates(date_param)}
          #{join_searchable_registration_date(date_param)}
          #{join_statuses(params['status'], status_filter_opts)}
          #{ManagedReports::SearchableFilterService.filter_next_steps(next_step, filter_opts)}
          #{ManagedReports::SearchableFilterService.filter_reporting_location(params['location'], filter_opts)}
          #{ManagedReports::SearchableFilterService.filter_scope(current_user, filter_opts)}
          #{ManagedReports::SearchableFilterService.filter_consent_reporting(filter_opts)}
          WHERE sex_values.record_type = 'Child'
          AND sex_values.field_name = 'sex'
        ),
        cases_with_duration_range AS (
          SELECT
            #{group_id&.+(',')}
            sex,
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
          sex,
          duration_range,
          COUNT(*) AS count
        FROM cases_with_duration_range
        GROUP BY #{group_id&.+(',')} sex, duration_range
      )
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize

    # rubocop:disable Metrics/MethodLength
    def duration_days_query
      ActiveRecord::Base.sanitize_sql_for_conditions(
        [
          %(
            CASE
              WHEN statuses.value = 'open' THEN EXTRACT(DAY FROM :current_date - registration_dates.value)
              WHEN statuses.value = 'closed' THEN EXTRACT(DAY FROM closure_dates.value - registration_dates.value)
            END AS duration_days
          ),
          { current_date: DateTime.now }
        ]
      )
    end
    # rubocop:enable Metrics/MethodLength

    def join_searchable_closure_dates(date_param)
      join_query = SearchableDatetime.where(field_name: 'date_closure').to_sql
      join_query = searchable_datetime_join_query(date_param) if date_param&.field_name == 'date_closure'

      %(
        LEFT JOIN (#{join_query}) AS closure_dates
        ON closure_dates.record_id = sex_values.record_id
        AND closure_dates.record_type = 'Child'
      )
    end

    def join_searchable_registration_date(date_param)
      join_query = SearchableDatetime.where(field_name: 'registration_date').to_sql
      join_query = searchable_datetime_join_query(date_param) if date_param&.field_name == 'registration_date'

      %(
        INNER JOIN (#{join_query}) AS registration_dates
        ON registration_dates.record_id = sex_values.record_id
        AND registration_dates.record_type = 'Child'
      )
    end

    def join_statuses(param, filter_opts)
      return ManagedReports::SearchableFilterService.filter_values(param, filter_opts) if param.present?

      %(
        INNER JOIN searchable_values AS statuses
        ON sex_values.record_id = statuses.record_id
        AND statuses.field_name = 'status'
        AND statuses.record_type = 'Child'
      )
    end

    def searchable_datetime_join_query(date_param)
      return unless date_param.present?

      ManagedReports::SearchableFilterService.searchable_date_range_query(date_param)
    end

    alias super_build_results build_results
    def build_results(results, params = {})
      super_build_results(results_in_percentages(results.to_a), params)
    end

    def fields
      %w[sex duration_range]
    end

    def result_map
      { 'key' => 'sex', 'name' => 'duration_range' }
    end
  end
end

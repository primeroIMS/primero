# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of cases by duration
# rubocop:disable Metrics/ClassLength
class ManagedReports::Indicators::PercentageCasesDuration < ManagedReports::SqlReportIndicator
  DATE_PARAM_CONFIG = {
    'date_closure' => { table_name: 'closure_dates' },
    'registration_date' => { table_name: 'registration_dates' }
  }.freeze

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

      %(
        WITH protection_assessment_cases AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            next_steps.record_id,
            sex_values.value AS sex,
            #{duration_days_query}
          FROM searchable_values AS next_steps
          #{join_searchable_sex_values}
          #{join_searchable_closure_dates(date_param)}
          #{join_searchable_registration_date(date_param)}
          #{join_searchable_statuses(params['status'])}
          #{join_reporting_locations(params['location'])}
          #{join_searchable_scope(current_user)}
          WHERE next_steps.record_type = 'Child'
          AND next_steps.field_name = 'next_steps'
          AND next_steps.value = 'a_continue_protection_assessment'
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
      join_condition = "closure_dates.field_name = 'date_closure'"
      join_condition = searchable_datetime_join_condition(date_param) if date_param&.field_name == 'date_closure'

      %(
        LEFT JOIN searchable_datetimes AS closure_dates
        ON next_steps.record_id = closure_dates.record_id
        AND closure_dates.record_type = 'Child'
        AND #{join_condition}
      )
    end

    def join_searchable_registration_date(date_param)
      join_condition = "registration_dates.field_name = 'registration_date'"
      join_condition = searchable_datetime_join_condition(date_param) if date_param&.field_name == 'registration_date'

      %(
        INNER JOIN searchable_datetimes AS registration_dates
        ON next_steps.record_id = registration_dates.record_id
        AND registration_dates.record_type = 'Child'
        AND #{join_condition}
      )
    end

    def searchable_datetime_join_condition(date_param)
      return unless date_param.present?

      searchable_date_range_query(date_param, DATE_PARAM_CONFIG.dig(date_param.field_name, :table_name))
    end

    def join_searchable_statuses(status_param)
      status_query = "statuses.field_name = 'status'"
      status_query = searchable_equal_value_multiple(status_param, 'statuses') if status_param.present?

      %(
        INNER JOIN searchable_values AS statuses
        ON statuses.record_id = next_steps.record_id
        AND statuses.record_type = 'Child'
        AND #{status_query}
      )
    end

    def join_searchable_sex_values
      %(
        INNER JOIN searchable_values AS sex_values
        ON sex_values.record_id = next_steps.record_id
        AND sex_values.record_type = 'Child'
        AND sex_values.field_name = 'sex'
      )
    end

    def join_searchable_scope(current_user)
      scope_query = searchable_user_scope_query(current_user)
      return unless scope_query.present?

      %(
        INNER JOIN (
          SELECT DISTINCT(record_id)
          FROM searchable_values
          WHERE searchable_values.record_type = 'Child'
          AND #{scope_query}
        ) AS scope_ids ON scope_ids.record_id = next_steps.record_id
      )
    end

    def join_reporting_locations(location_param)
      reporting_location_query = searchable_reporting_location_query(location_param, 'Child', 'owned_by_location')
      return unless reporting_location_query.present?

      %(
        INNER JOIN (#{reporting_location_query}) AS location_record_ids
        ON location_record_ids.record_id = next_steps.record_id
      )
    end

    alias super_build_results build_results
    def build_results(results, params = {})
      results_array = results.to_a
      results_with_percentages = if results_array.any? { |result| result.key?('group_id') }
                                   in_percentages_by_group(results_array)
                                 else
                                   in_percentages(results_array)
                                 end

      super_build_results(results_with_percentages, params)
    end

    def in_percentages_by_group(results)
      total_by_fields = calculate_total_by_fields(%w[sex duration_range], results)
      total_by_group = calculate_total_by_group(results)

      results.map do |result|
        total_records_in_group = total_by_group[result['group_id']]
        result_in_percentages(result, total_by_fields, total_records_in_group).merge('group_id' => result['group_id'])
      end
    end

    def in_percentages(results)
      total_by_fields = calculate_total_by_fields(%w[sex duration_range], results)
      total_records = BigDecimal(results.sum { |result| result['count'] })
      results.map { |result| result_in_percentages(result, total_by_fields, total_records) }
    end

    def result_in_percentages(result, total_by_fields, total_records)
      total_sex = total_by_fields[result_group_key(result, 'sex')]
      total_duration = total_by_fields[result_group_key(result, 'duration_range')]
      {
        'name' => result['duration_range'],
        'key' => result['sex'],
        'sum' => ((result['count'] * 100) / total_sex).round(2),
        'total' => ((total_duration * 100) / total_records).round(2)
      }
    end

    def calculate_total_by_fields(fields, results)
      fields.reduce({}) do |memo, field|
        grouped_results = results.group_by { |result| result_group_key(result, field) }
        memo.merge(
          grouped_results.transform_values { |values| BigDecimal(values.sum { |value| value['count'] }) }
        )
      end
    end

    def calculate_total_by_group(results)
      results.group_by { |result| result['group_id'] }.transform_values do |values|
        BigDecimal(values.sum { |value| value['count'] })
      end
    end

    def result_group_key(result, field)
      [result['group_id'], result[field]].join('-')
    end
  end
end
# rubocop:enable Metrics/ClassLength

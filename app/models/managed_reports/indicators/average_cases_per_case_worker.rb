# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the average cases per case worker
class ManagedReports::Indicators::AverageCasesPerCaseWorker < ManagedReports::SqlReportIndicator
  # rubocop:disable Metrics/ClassLength
  class << self
    def id
      'average_cases_per_case_worker'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      date_query = grouped_date_query(params['grouped_by'], date_param, 'searchable_datetimes', nil, 'value')
      group_id = date_query.present? ? 'group_id' : nil

      %{
        WITH protection_cases AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            data->>'owned_by' AS owned_by,
            data->>'sex' AS sex
          FROM cases
          #{join_next_steps}
          #{join_searchable_statuses(params['status'])}
          #{join_searchable_datetimes(date_param)}
          #{join_searchable_scope(current_user)}
        )
        SELECT
         #{group_id&.+(',')}
         owned_by,
         sex,
         COUNT(*)
        FROM protection_cases
        GROUP BY #{group_id&.+(',')} owned_by, sex
      }
    end

    # rubocop:enable Metrics/MethodLength
    def join_searchable_datetimes(date_param)
      return unless date_param.present?

      %(
        INNER JOIN searchable_datetimes searchable_datetimes
        ON cases.id = searchable_datetimes.record_id
        AND searchable_datetimes.record_type = 'Child'
        #{searchable_date_range_query(date_param)&.prepend('AND ')}
      )
    end

    def join_searchable_statuses(status_param)
      status_query = searchable_equal_value_multiple(status_param)
      return unless status_query.present?

      %(
        INNER JOIN (
          SELECT record_id FROM searchable_values
          WHERE searchable_values.record_type = 'Child'
          AND #{status_query}
        ) AS statuses ON statuses.record_id = cases.id
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
        ) AS scope_ids ON scope_ids.record_id = cases.id
      )
    end

    def join_next_steps
      %(
        INNER JOIN (
          SELECT DISTINCT(record_id)
          FROM searchable_values
          WHERE searchable_values.record_type = 'Child'
          AND searchable_values.field_name = 'next_steps'
          AND searchable_values.value = 'a_continue_protection_assessment'
        ) AS next_steps_ids ON next_steps_ids.record_id = cases.id
      )
    end

    alias super_build_results build_results
    def build_results(results, params = {})
      super_build_results(results_in_average(results.to_a), params)
    end

    def results_in_average(results)
      return in_average_by_group(results) if results.any? { |result| result.key?('group_id') }

      in_average(results)
    end

    def in_average_by_group(results)
      grouped_results = group_results_by_field('sex', results)
      grouped_results.each_with_object([]) do |(group_id, groups), memo|
        values = groups.values.flatten
        total_records = calculate_total_records(values)
        total_users = calculate_total_users(values)
        groups.each do |group|
          memo << result_in_averages(group, total_records, total_users).merge('group_id' => group_id)
        end
      end
    end

    def in_average(results)
      grouped_results = group_results_by_field('sex', results)
      values = grouped_results.values.flatten
      total_records = calculate_total_records(values)
      total_users = calculate_total_users(values)

      grouped_results.each_with_object([]) do |group, memo|
        memo << result_in_averages(group, total_records, total_users)
      end
    end

    def result_in_averages(group, total_records, total_users)
      key = group.first
      values = group.last
      total_records_by_field = BigDecimal(values['count'])
      {
        'name' => 'average_cases_per_case_worker',
        'key' => key,
        'sum' => (total_records_by_field / total_users).round(2),
        'total' => (total_records / total_users).round(2)
      }
    end

    def calculate_total_records(values)
      BigDecimal(values.sum { |value| value['count'] })
    end

    def calculate_total_users(values)
      BigDecimal(values.map { |value| value['owned_by'] }.flatten.uniq.size)
    end

    def group_results_by_field(field, results)
      results.each_with_object({}) do |result, memo|
        group_id = result['group_id']
        value = result[field]
        if group_id.present?
          memo[group_id] = (memo[group_id] || {}).merge(value => aggregate_values(result, memo.dig(group_id, value)))
        else
          memo[value] = aggregate_values(result, memo[value])
        end
      end
    end

    def aggregate_values(result, current)
      count = current&.dig('count') || 0
      owned_by = current&.dig('owned_by') || []
      owned_by << result['owned_by'] if owned_by.exclude?(result['owned_by'])

      { 'count' => count + result['count'], 'owned_by' => owned_by }
    end
  end
  # rubocop:enable Metrics/ClassLength
end

# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the average cases per case worker
class ManagedReports::Indicators::AverageCasesPerCaseWorker < ManagedReports::SqlReportIndicator
  class << self
    def id
      'average_cases_per_case_worker'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_group_query = build_date_group(params, {}, Child)
      group_id = date_group_query.present? ? 'group_id' : nil
      %{
        WITH protection_cases AS (
          SELECT
            #{date_group_query&.+(' AS group_id,')}
            data->>'owned_by' AS owned_by,
            COALESCE(srch_gender, 'incomplete_data') AS gender
          FROM cases
          WHERE srch_next_steps && '{a_continue_protection_assessment}'
          #{build_filter_query(current_user, params)&.prepend('AND ')}
        )
        SELECT
         #{group_id&.+(',')}
         owned_by,
         gender,
         COUNT(*)
        FROM protection_cases
        GROUP BY #{group_id&.+(',')} owned_by, gender
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
      super_build_results(results_in_average(results.to_a), params)
    end

    def results_in_average(results)
      return in_average_by_group(results) if results.any? { |result| result.key?('group_id') }

      in_average(results)
    end

    def in_average_by_group(results)
      grouped_results = group_results_by_field('gender', results)
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
      grouped_results = group_results_by_field('gender', results)
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
end

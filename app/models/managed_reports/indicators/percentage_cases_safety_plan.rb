# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of clients with a safety plan
class ManagedReports::Indicators::PercentageCasesSafetyPlan < ManagedReports::SqlReportIndicator
  include ManagedReports::PercentageIndicator

  class << self
    def id
      'percentage_cases_safety_plan'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_group_query = build_date_group(params, {}, Child)
      group_id = date_group_query.present? ? 'group_id' : nil
      %(
        WITH disability_cases AS (
          SELECT
            #{date_group_query&.+(' AS group_id,')}
            srch_begin_safety_plan_prompt AS safety_plan,
            COALESCE(srch_gender, 'incomplete_data') AS gender
          FROM cases
          WHERE srch_next_steps && '{a_continue_protection_assessment}'
          #{build_filter_query(current_user, params)&.prepend('AND ')}
        )
        SELECT
          #{group_id&.+(',')}
          safety_plan,
          gender,
          COUNT(*)
        FROM disability_cases
        GROUP BY #{group_id&.+(',')} safety_plan, gender
      )
    end
    # rubocop:enable Metrics/MethodLength

    def build_filter_query(current_user, params = {})
      filters = [
        params['status'],
        ManagedReports::FilterService.reporting_location(params['location']),
        ManagedReports::FilterService.to_datetime(filter_date(params)),
        ManagedReports::FilterService.module_id(params['module_id']),
        ManagedReports::FilterService.consent_reporting,
        ManagedReports::FilterService.scope(current_user)
      ].compact
      return unless filters.present?

      filters.map { |filter| filter.query(Child) }.join(' AND ')
    end

    alias super_build_results build_results
    def build_results(results, params = {})
      result_array = write_safety_plan_completion(results.to_a)
      super_build_results(results_in_percentages(result_array), params)
    end

    def write_safety_plan_completion(results)
      results.each_with_object([]) do |result, memo|
        if result['safety_plan'] == true
          memo << result.merge('safety_plan' => 'safety_plan_completed')
        else
          recalculate_safety_plan_not_completed(memo, result)
        end
      end
    end

    def recalculate_safety_plan_not_completed(results, current)
      safety_plan_not_completed = find_safety_plan_not_completed(results, current)
      if safety_plan_not_completed.present?
        safety_plan_not_completed['count'] += current['count']
      else
        results << current.merge('safety_plan' => 'safety_plan_not_completed')
      end
    end

    def find_safety_plan_not_completed(results, opts)
      results.find do |elem|
        same_elem = elem['safety_plan'] == 'safety_plan_not_completed' && elem['gender'] == opts['gender']
        next same_elem unless opts.key?('group_id')

        opts['group_id'] == elem['group_id'] && same_elem
      end
    end

    def fields
      %w[gender safety_plan]
    end

    def result_map
      { 'key' => 'gender', 'name' => 'safety_plan' }
    end
  end
end

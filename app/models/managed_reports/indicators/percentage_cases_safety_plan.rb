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
      date_param = filter_date(params)
      date_query = grouped_date_query(params['grouped_by'], date_param, 'searchable_datetimes', nil, 'value')
      group_id = date_query.present? ? 'group_id' : nil
      %(
        WITH disability_cases AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            data->>'begin_safety_plan_prompt' AS safety_plan,
            data->>'sex' AS sex
          FROM cases
          #{join_searchable_next_steps}
          #{join_searchable_datetimes(date_param)}
          #{join_searchable_statuses(params['status'])}
          #{join_reporting_locations(params['location'])}
          #{join_searchable_scope(current_user)}
        )
        SELECT
          #{group_id&.+(',')}
          safety_plan,
          sex,
          COUNT(*)
        FROM disability_cases
        GROUP BY #{group_id&.+(',')} safety_plan, sex
      )
    end
    # rubocop:enable Metrics/MethodLength

    def join_searchable_next_steps
      %(
        INNER JOIN (
          SELECT DISTINCT(record_id) FROM searchable_values
          WHERE searchable_values.record_type = 'Child'
          AND searchable_values.field_name = 'next_steps'
          AND searchable_values.value = 'a_continue_protection_assessment'
        ) AS next_steps
        ON next_steps.record_id = cases.id
      )
    end

    def join_searchable_datetimes(date_param)
      return unless date_param.present?

      %(
        INNER JOIN searchable_datetimes searchable_datetimes
        ON next_steps.record_id = searchable_datetimes.record_id
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
        ) AS statuses ON statuses.record_id = next_steps.record_id
      )
    end

    def join_searchable_scope(current_user)
      scope_query = searchable_user_scope_query(current_user)
      return unless scope_query.present?

      %(
        INNER JOIN (
          SELECT DISTINCT(record_id) FROM searchable_values
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
      result_array = write_safety_plan_completion(results.to_a)
      super_build_results(results_in_percentages(result_array), params)
    end

    def write_safety_plan_completion(results)
      results.each_with_object([]) do |result, memo|
        if result['safety_plan'] == 'true'
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
        same_elem = elem['safety_plan'] == 'safety_plan_not_completed' && elem['sex'] == opts['sex']
        next same_elem unless opts.key?('group_id')

        opts['group_id'] == elem['group_id'] && same_elem
      end
    end

    def fields
      %w[sex safety_plan]
    end

    def result_map
      { 'key' => 'sex', 'name' => 'safety_plan' }
    end
  end
end

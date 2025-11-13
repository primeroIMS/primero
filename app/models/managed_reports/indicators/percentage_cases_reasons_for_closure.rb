# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# An indicator that returns the percentage of cases by reason for closure
class ManagedReports::Indicators::PercentageCasesReasonsForClosure < ManagedReports::SqlReportIndicator
  include ManagedReports::PercentageIndicator

  class << self
    def id
      'percentage_case_reasons_for_closure'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      date_group_query = build_date_group(params, {}, Child)
      group_id = date_group_query.present? ? 'group_id' : nil

      <<~SQL
        WITH cases_in_scope AS (
          SELECT
            #{date_group_query&.+(' AS group_id,')}
            COALESCE(data->>'closure_reason', 'incomplete_data') AS closure_reason,
            COALESCE(srch_sex, 'incomplete_data') AS sex
          FROM cases
          WHERE srch_status = 'closed'
          #{params['record_state']&.query(Child)&.prepend('AND ')}
          #{user_scope_query(current_user, 'cases')&.prepend('AND ')}
          #{date_param&.query(Child)&.prepend('AND ')}
          #{params['age']&.query(Child)&.prepend('AND ')}
          #{params['protection_concerns']&.query(Child)&.prepend('AND ')}
        )
        SELECT
          #{group_id&.+(',')}
          closure_reason,
          sex,
          COUNT(*)
        FROM cases_in_scope
        GROUP BY #{group_id&.+(',')} closure_reason, sex
      SQL
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity

    def fields
      %w[closure_reason sex]
    end

    def result_map
      { 'key' => 'sex', 'name' => 'closure_reason' }
    end

    alias super_build_results build_results
    def build_results(results, params = {})
      super_build_results(results_in_percentages(results.to_a), params)
    end
  end
end

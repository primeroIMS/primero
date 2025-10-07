# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of cases by risk level
class ManagedReports::Indicators::PercentageCasesRiskLevel < ManagedReports::SqlReportIndicator
  include ManagedReports::PercentageIndicator
  class << self
    def id
      'percentage_cases_risk_level'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_group_query = build_date_group(params, {}, Child)
      group_id = date_group_query.present? ? 'group_id' : nil

      %(
        WITH protection_assessment_cases AS (
          SELECT
            #{date_group_query&.+(' AS group_id,')}
            COALESCE(srch_risk_level, 'incomplete_data') as risk_level,
            cases.id AS id,
            COALESCE(srch_gender, 'incomplete_data') AS gender
          FROM cases
          WHERE srch_next_steps && '{a_continue_protection_assessment}'
          #{build_filter_query(current_user, params)&.prepend('AND ')}
        )
        SELECT
          #{group_id&.+(',')}
          risk_level,
          gender,
          COUNT(*) AS count
        FROM protection_assessment_cases
        GROUP BY #{group_id&.+(',')} risk_level, gender
      )
    end

    # rubocop:enable Metrics/MethodLength
    def build_filter_query(current_user, params = {})
      filters = [
        params['status'],
        ManagedReports::FilterService.reporting_location(params['location']),
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
      %w[gender risk_level]
    end

    def result_map
      { 'key' => 'gender', 'name' => 'risk_level' }
    end
  end
end

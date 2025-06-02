# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of clients less impacted by protection risks after receiving support
class ManagedReports::Indicators::LessImpactedAfterSupport < ManagedReports::SqlReportIndicator
  include ManagedReports::PercentageIndicator

  class << self
    def id
      'less_impacted_after_support'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_group_query = build_date_group(params, {}, Child)
      group_id = date_group_query.present? ? 'group_id' : nil
      %{
        WITH impacted_ranges AS (
          SELECT
            #{date_group_query&.+(' AS group_id,')}
            srch_closure_problems_severity_int AS closure_problems_severity,
            srch_client_summary_worries_severity_int AS client_summary_worries_severity,
            CASE WHEN srch_closure_problems_severity_int < srch_client_summary_worries_severity_int
            THEN 'clients_report_less_impacted'
            ELSE 'clients_report_equally_or_more_severely_impacted'
            END AS impact_range,
            COALESCE(srch_gender, 'incomplete_data') AS gender
          FROM cases
          WHERE srch_next_steps && '{a_continue_protection_assessment}'
          AND srch_client_summary_worries_severity_int >= 0
          AND srch_closure_problems_severity_int >= 0
          #{build_filter_query(current_user, params)&.prepend('AND ')}
        )
        SELECT
          #{group_id&.+(', ')}
          impact_range,
          gender,
          COUNT(*)
        FROM impacted_ranges
        GROUP BY #{group_id&.+(',')} impact_range, gender
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
      %w[gender impact_range]
    end

    def result_map
      { 'key' => 'gender', 'name' => 'impact_range' }
    end
  end
end

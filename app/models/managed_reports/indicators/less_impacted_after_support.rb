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
      date_param = filter_date(params)
      date_query = grouped_date_query(params['grouped_by'], date_param, 'searchable_datetimes', nil, 'value')
      group_id = date_query.present? ? 'group_id' : nil
      %{
        WITH impacted_ranges AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            CAST(data->>'closure_problems_severity' AS INTEGER) AS closure_problems_severity,
            CAST(data->>'client_summary_worries_severity' AS INTEGER) AS client_summary_worries_severity,
            CASE WHEN CAST(
              data->>'closure_problems_severity' AS INTEGER
            ) < CAST(data->>'client_summary_worries_severity' AS INTEGER)
            THEN 'clients_report_less_impacted'
            ELSE 'clients_report_equally_or_more_severely_impacted'
            END AS impact_range,
            data->>'sex' AS sex
          FROM cases
          #{ManagedReports::SearchableFilterService.filter_values(params['status'])}
          #{ManagedReports::SearchableFilterService.filter_datetimes(date_param)}
          #{ManagedReports::SearchableFilterService.filter_scope(current_user)}
          #{ManagedReports::SearchableFilterService.filter_next_steps}
          #{ManagedReports::SearchableFilterService.filter_consent_reporting}
          WHERE (
            cases.data @? '$[*]
              ? (@.client_summary_worries_severity like_regex "[0-9]")
              ? (@.closure_problems_severity like_regex "[0-9]")'
          )
        )
        SELECT
          #{group_id&.+(', ')}
          impact_range,
          sex,
          COUNT(*)
        FROM impacted_ranges
        GROUP BY #{group_id&.+(',')} impact_range, sex
      }
    end
    # rubocop:enable Metrics/MethodLength
    #
    alias super_build_results build_results
    def build_results(results, params = {})
      super_build_results(results_in_percentages(results.to_a), params)
    end

    def fields
      %w[sex impact_range]
    end

    def result_map
      { 'key' => 'sex', 'name' => 'impact_range' }
    end
  end
end

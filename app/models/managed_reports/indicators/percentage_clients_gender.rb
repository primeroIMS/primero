# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of clients by gender
class ManagedReports::Indicators::PercentageClientsGender < ManagedReports::SqlReportIndicator
  include ManagedReports::PercentageIndicator

  class << self
    def id
      'percentage_clients_gender'
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
            COALESCE(data->>'gender', 'incomplete_data') AS gender
          FROM cases
          #{ManagedReports::SearchableFilterService.filter_next_steps}
          #{ManagedReports::SearchableFilterService.filter_datetimes(date_param)}
          #{ManagedReports::SearchableFilterService.filter_values(params['status'])}
          #{ManagedReports::SearchableFilterService.filter_reporting_location(params['location'])}
          #{ManagedReports::SearchableFilterService.filter_scope(current_user)}
          #{ManagedReports::SearchableFilterService.filter_consent_reporting}
        )
        SELECT
          #{group_id&.+(',')}
          gender,
          COUNT(*)
        FROM disability_cases
        GROUP BY #{group_id&.+(',')} gender
      )
    end
    # rubocop:enable Metrics/MethodLength

    alias super_build_results build_results
    def build_results(results, params = {})
      super_build_results(results_in_percentages(results.to_a), params)
    end

    def fields
      %w[gender]
    end

    def result_in_percentages(result, total_by_fields, total_records)
      {
        id: result[result_map['key']],
        total: calculate_total(result, total_by_fields, total_records)
      }
    end

    def result_map
      { 'key' => 'gender', 'name' => 'gender' }
    end
  end
end

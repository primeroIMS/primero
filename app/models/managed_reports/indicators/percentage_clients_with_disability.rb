# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of clients with disability
class ManagedReports::Indicators::PercentageClientsWithDisability < ManagedReports::SqlReportIndicator
  include ManagedReports::PercentageIndicator

  class << self
    def id
      'percentage_clients_with_disability'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_group_query = build_date_group(params, {}, Child)
      group_id = date_group_query.present? ? 'group_id' : nil
      %(
        WITH disability_cases AS (
          SELECT
            #{date_group_query&.+(' AS group_id,')}
            COALESCE(srch_disability_status_yes_no, 'incomplete_data') AS disability_status,
            COALESCE(srch_gender, 'incomplete_data') AS gender
          FROM cases
          WHERE srch_next_steps && '{a_continue_protection_assessment}'
          #{build_filter_query(current_user, params)&.prepend('AND ')}
        )
        SELECT
          #{group_id&.+(',')}
          disability_status,
          gender,
          COUNT(*)
        FROM disability_cases
        GROUP BY #{group_id&.+(',')} disability_status, gender
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
      %w[gender disability_status]
    end

    def result_map
      { 'key' => 'gender', 'name' => 'disability_status' }
    end
  end
end

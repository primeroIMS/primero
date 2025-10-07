# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of incidents
class ManagedReports::Indicators::TotalProtectionManagementCases < ManagedReports::SqlReportIndicator
  class << self
    def id
      'total_protection_management_cases'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_group_query = build_date_group(params, {}, Child)
      group_id = date_group_query.present? ? 'group_id' : nil
      %{
        WITH protection_cases AS (
          SELECT
            #{date_group_query&.+(' AS group_id,')}
            COALESCE(data->>'gender', 'incomplete_data') AS key,
            srch_status AS name
          FROM cases
          WHERE srch_next_steps && '{a_continue_protection_assessment}'
          #{build_filter_query(current_user, params)&.prepend('AND ')}
        )
        SELECT
          key,
          name,
          #{group_id&.+(',')}
          COUNT(*) AS sum,
          SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} name)::INT AS total
        FROM protection_cases
        GROUP BY #{group_id&.+(',')} key, name
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
  end
end

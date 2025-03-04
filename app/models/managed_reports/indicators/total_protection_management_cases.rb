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
      date_param = filter_date(params)
      date_query = grouped_date_query(params['grouped_by'], date_param, 'searchable_datetimes', nil, 'value')
      group_id = date_query.present? ? 'group_id' : nil
      %{
        WITH protection_cases AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            COALESCE(data->>'gender', 'incomplete_data') AS key,
            statuses.value AS name
          FROM cases
          #{join_statuses_values(params['status'])}
          #{ManagedReports::SearchableFilterService.filter_scope(current_user)}
          #{ManagedReports::SearchableFilterService.filter_datetimes(date_param)}
          #{ManagedReports::SearchableFilterService.filter_consent_reporting}
          #{ManagedReports::SearchableFilterService.filter_next_steps}
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

    def join_statuses_values(param)
      return ManagedReports::SearchableFilterService.filter_values(param, { join_alias: 'statuses' }) if param.present?

      %(
        INNER JOIN searchable_values AS statuses
        ON cases.id = statuses.record_id
        AND statuses.field_name = 'status'
        AND statuses.record_type = 'Child'
      )
    end
  end
end

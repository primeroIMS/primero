# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of incidents grouped by context
class ManagedReports::Indicators::GBVCaseContext < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_case_context'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        SELECT
          context AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          COUNT(*) AS total
        FROM incidents,
        JSONB_ARRAY_ELEMENTS_TEXT(data -> 'gbv_case_context') AS context
         WHERE data @? '$[*] ? (
          @.consent_reporting  == "true" && @.gbv_case_context != null
        ) ? (
          !exists(@.gbv_reported_elsewhere) || @.gbv_reported_elsewhere != "gbvims-org"
        )'
        #{date_range_query(date_param)&.prepend('AND ')}
        #{equal_value_query(params['module_id'])&.prepend('AND ')}
        #{user_scope_query(current_user)&.prepend('AND ')}
        GROUP BY context
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
        ORDER BY context
      }
    end
    # rubocop:enable Metrics/MethodLength
  end
end

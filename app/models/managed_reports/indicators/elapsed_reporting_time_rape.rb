# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of incidents grouped by elapsed_reporting_time
# and where the gbv_sexual_violence_type is rape
class ManagedReports::Indicators::ElapsedReportingTimeRape < ManagedReports::SqlReportIndicator
  class << self
    def id
      'elapsed_reporting_time_rape'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        SELECT
          data->> 'elapsed_reporting_time' AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          COUNT(*) AS total
        FROM incidents
        WHERE data @? '$[*] ? (
          @.consent_reporting  == "true" && @.elapsed_reporting_time != null && @.gbv_sexual_violence_type == "rape"
        ) ? (
          !exists(@.gbv_reported_elsewhere) || @.gbv_reported_elsewhere != "gbvims-org"
        )'
        #{date_range_query(date_param)&.prepend('AND ')}
        #{equal_value_query(params['module_id'])&.prepend('AND ')}
        #{user_scope_query(current_user)&.prepend('AND ')}
        GROUP BY data ->> 'elapsed_reporting_time'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
        ORDER BY id
      }
    end
    # rubocop:enable Metrics/MethodLength
  end
end

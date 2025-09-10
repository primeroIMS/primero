# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of incidents grouped by gbv_sexual_violence_type
class ManagedReports::Indicators::GBVSexualViolenceType < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_sexual_violence_type'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        SELECT
          data->> 'gbv_sexual_violence_type' AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          COUNT(*) AS total
        FROM incidents
        WHERE data @? '$[*] ? (
          @.consent_reporting  == "true" && @.gbv_sexual_violence_type != null
        ) ? (
          !exists(@.gbv_reported_elsewhere) || @.gbv_reported_elsewhere != "gbvims-org"
        )'
        #{date_range_query(date_param)&.prepend('AND ')}
        #{equal_value_query(params['module_id'])&.prepend('AND ')}
        #{user_scope_query(current_user)&.prepend('AND ')}
        GROUP BY data ->> 'gbv_sexual_violence_type'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
        ORDER BY id
      }
    end
    # rubocop:enable Metrics/MethodLength
  end
end

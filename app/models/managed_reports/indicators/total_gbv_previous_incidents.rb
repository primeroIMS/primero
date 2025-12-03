# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of incidents with a previous incident
class ManagedReports::Indicators::TotalGBVPreviousIncidents < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_previous_incidents'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      <<~SQL
        SELECT
          'gbv_previous_incidents' AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          COUNT(*) AS total
        FROM incidents
        WHERE srch_record_state = TRUE
        AND data @? '$[*] ? (
          @.gbv_previous_incidents == "true" && @.consent_reporting  == "true"
        ) ? (
          !exists(@.gbv_reported_elsewhere) || @.gbv_reported_elsewhere != "gbvims-org"
        )'
        #{date_range_query(date_param)&.prepend('AND ')}
        #{user_scope_query(current_user)&.prepend('AND ')}
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
      SQL
    end
    # rubocop:enable Metrics/MethodLength
  end
end

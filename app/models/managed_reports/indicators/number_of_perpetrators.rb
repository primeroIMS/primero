# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of incidents grouped by the number_of_perpetrators
class ManagedReports::Indicators::NumberOfPerpetrators < ManagedReports::SqlReportIndicator
  class << self
    def id
      'number_of_perpetrators'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      <<~SQL
        SELECT
          data ->>'number_of_perpetrators' AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          COUNT(*) AS total
        FROM incidents
        WHERE srch_record_state = TRUE
        AND data @? '$[*] ? (
          @.consent_reporting  == "true" && @.number_of_perpetrators != null
        ) ? (
          !exists(@.gbv_reported_elsewhere) || @.gbv_reported_elsewhere != "gbvims-org"
        )'
        #{date_range_query(date_param)&.prepend('AND ')}
        #{equal_value_query(params['module_id'])&.prepend('AND ')}
        #{user_scope_query(current_user)&.prepend('AND ')}
        GROUP BY data ->>'number_of_perpetrators'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
        ORDER BY id
      SQL
    end
    # rubocop:enable Metrics/MethodLength
  end
end

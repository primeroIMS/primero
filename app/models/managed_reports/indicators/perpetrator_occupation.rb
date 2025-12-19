# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of incidents grouped by the perpetrator_occupation
class ManagedReports::Indicators::PerpetratorOccupation < ManagedReports::SqlReportIndicator
  class << self
    def id
      'perpetrator_occupation'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)

      <<~SQL
        SELECT
          alleged_perpetrators.perpetrator_occupation AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          COUNT(*) AS total
        FROM incidents
        CROSS JOIN LATERAL(
          SELECT
            perpetrators->>'perpetrator_occupation' AS perpetrator_occupation
          FROM JSONB_ARRAY_ELEMENTS(data->'alleged_perpetrator') AS perpetrators
          WHERE perpetrators->>'primary_perpetrator' = 'primary'
        ) AS alleged_perpetrators
        WHERE srch_record_state = TRUE
        AND data @? '$[*] ? (@.consent_reporting  == "true") ? (
          !exists(@.gbv_reported_elsewhere) || @.gbv_reported_elsewhere != "gbvims-org"
        )'
        #{date_range_query(date_param)&.prepend('AND ')}
        #{equal_value_query(params['module_id'])&.prepend('AND ')}
        #{user_scope_query(current_user)&.prepend('AND ')}
        GROUP BY alleged_perpetrators.perpetrator_occupation
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
      SQL
    end
    # rubocop:enable Metrics/MethodLength
  end
end

# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of incidents grouped by perpetrator_relationship
class ManagedReports::Indicators::PerpetratorRelationship < ManagedReports::SqlReportIndicator
  class << self
    def id
      'perpetrator_relationship'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)

      <<~SQL
        SELECT
          alleged_perpetrators.perpetrator_relationship AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          COUNT(*) AS total
        FROM incidents
        CROSS JOIN LATERAL(
          SELECT
            perpetrators->>'perpetrator_relationship' AS perpetrator_relationship
          FROM jsonb_array_elements(data->'alleged_perpetrator') AS perpetrators
          WHERE perpetrators->>'primary_perpetrator' = 'primary'
        ) AS alleged_perpetrators
        WHERE srch_record_state = TRUE
        AND data @? '$[*] ? (@.consent_reporting  == "true") ? (
          !exists(@.gbv_reported_elsewhere) || @.gbv_reported_elsewhere != "gbvims-org"
        )'
        #{date_range_query(date_param)&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        GROUP BY alleged_perpetrators.perpetrator_relationship
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
      SQL
    end
    # rubocop:enable Metrics/MethodLength
  end
end

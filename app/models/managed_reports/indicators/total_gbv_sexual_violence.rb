# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of incidents with a gbv_sexual_violence_type
class ManagedReports::Indicators::TotalGBVSexualViolence < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_sexual_violence'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      <<~SQL
        SELECT
         'incidents' AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          count(*) AS total
        FROM  incidents
        WHERE srch_record_state = TRUE
        AND data @? '$[*] ? (
          @.consent_reporting == "true" && @.gbv_sexual_violence_type != null && @.gbv_sexual_violence_type != "non-gbv"
        ) ? (
          !exists(@.gbv_reported_elsewhere) || @.gbv_reported_elsewhere != "gbvims-org"
        )'
        #{date_range_query(date_param)&.prepend('AND ')}
        #{equal_value_query(params['module_id'])&.prepend('AND ')}
        #{user_scope_query(current_user)&.prepend('AND ')}
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend('GROUP BY ')}
      SQL
    end
    # rubocop:enable Metrics/MethodLength
  end
end

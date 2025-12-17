# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the survivors by displacement incident
class ManagedReports::Indicators::SurvivorsDisplacementIncident < ManagedReports::SqlReportIndicator
  class << self
    def id
      'displacement_incident'
    end

    def sql(current_user, params = {})
      date_param = filter_date(params)
      <<~SQL
        SELECT
          data ->> 'displacement_incident' AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          COUNT(*) AS total
        FROM incidents
        WHERE srch_record_state = TRUE
        AND data @? '$[*] ? (@.displacement_incident != null && @.consent_reporting == "true")'
        #{date_range_query(date_param)&.prepend('AND ')}
        #{equal_value_query(params['module_id'])&.prepend('AND ')}
        #{user_scope_query(current_user)&.prepend('AND ')}
        GROUP BY data ->> 'displacement_incident'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
      SQL
    end
  end
end

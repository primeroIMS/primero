# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the survivors by displacement status
class ManagedReports::Indicators::SurvivorsDisplacementStatus < ManagedReports::SqlReportIndicator
  class << self
    def id
      'displacement_status'
    end

    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        SELECT
          data ->> 'displacement_status' AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          COUNT(*) AS total
        FROM incidents
        WHERE data @? '$[*] ? (@.displacement_status != null && @.consent_reporting == "true")'
        #{date_range_query(date_param)&.prepend('AND ')}
        #{equal_value_query(params['module_id'])&.prepend('AND ')}
        #{user_scope_query(current_user)&.prepend('AND ')}
        GROUP BY data ->> 'displacement_status'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
      }
    end
  end
end

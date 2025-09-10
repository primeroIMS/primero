# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the survivors by marital status
class ManagedReports::Indicators::SurvivorsMaritalStatus < ManagedReports::SqlReportIndicator
  class << self
    def id
      'marital_status'
    end

    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        SELECT
          data ->> 'maritial_status' AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          COUNT(*) AS total
        FROM incidents
        WHERE data @? '$[*] ? (@.maritial_status != null && @.consent_reporting == "true")'
        #{date_range_query(date_param)&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        GROUP BY data ->> 'maritial_status'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(',')}
      }
    end
  end
end

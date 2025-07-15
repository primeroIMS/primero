# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the survivors by age
class ManagedReports::Indicators::SurvivorsSex < ManagedReports::SqlReportIndicator
  class << self
    def id
      'sex'
    end

    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        SELECT
          data ->> 'sex' AS id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
          COUNT(*) AS total
        FROM incidents
        WHERE data @? '$[*] ? (@.sex != null && @.consent_reporting == "true")'
        #{date_range_query(date_param)&.prepend('AND ')}
        #{equal_value_query(params['module_id'])&.prepend('AND ')}
        #{user_scope_query(current_user)&.prepend('AND ')}
        GROUP BY data ->> 'sex'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
      }
    end
  end
end

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
        select
          data ->> 'displacement_status' as id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from incidents
        where data ->> 'displacement_status' is not null
        #{date_range_query(date_param)&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by data ->> 'displacement_status'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
      }
    end
  end
end

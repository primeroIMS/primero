# frozen_string_literal: true

# An indicator that returns the total of incidents
class ManagedReports::Indicators::TotalIncidents < ManagedReports::SqlReportIndicator
  class << self
    def id
      'total'
    end

    def sql(current_user, params = {})
      date_param = params['incident_date'] || params['date_of_first_report']
      %{
        select
        'incidents' as id,
         #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from incidents
        where 1 = 1
        #{user_scope_query(current_user)&.prepend('and ')}
        #{date_range_query(date_param)&.prepend('and ')}
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
      }
    end
  end
end

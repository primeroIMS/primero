# frozen_string_literal: true

# An indicator that returns the total of incidents with a previous incident
class ManagedReports::Indicators::TotalGBVPreviousIncidents < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_previous_incidents'
    end

    def sql(current_user, params = {})
      date_param = params['incident_date'] || params['date_of_first_report']
      %{
        select
          'gbv_previous_incidents' as id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from incidents
        where data ->> 'gbv_previous_incidents' = 'true'
        #{date_range_query(date_param)&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
      }
    end
  end
end

# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by incident_timeofday
class ManagedReports::Indicators::IncidentTimeofday < ManagedReports::SqlReportIndicator
  class << self
    def id
      'incident_timeofday'
    end

    def sql(current_user, params = {})
      date_param = params['incident_date'] || params['date_of_first_report']
      %{
        select
          data->> 'incident_timeofday' as id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from incidents
        where data->> 'incident_timeofday' is not null
        #{date_range_query(date_param)&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by data ->> 'incident_timeofday'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
      }
    end
  end
end

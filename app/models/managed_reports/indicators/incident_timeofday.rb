# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by incident_timeofday
class ManagedReports::Indicators::IncidentTimeofday < ManagedReports::SqlReportIndicator
  class << self
    def id
      'incident_timeofday'
    end

    def sql(_current_user, params = {})
      %{
        select
          data->> 'incident_timeofday' as id ,
          count(*) as total
        from incidents
        where data->> 'incident_timeofday' is not null
        #{date_range_query(params['incident_date'])&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'])&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        group by data ->> 'incident_timeofday'
      }
    end

    def build(current_user = nil, args = {})
      super(current_user, args, &:to_a)
    end
  end
end

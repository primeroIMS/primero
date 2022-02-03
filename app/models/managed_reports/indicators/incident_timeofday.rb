# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by incident_timeofday
class ManagedReports::Indicators::IncidentTimeofday < ManagedReports::SqlReportIndicator
  class << self
    def id
      'incident_timeofday'
    end

    def sql(_current_user, params = [])
      %{
        select
          data->> 'incident_timeofday' as id ,
          count(*) as total
        from incidents
        where data->> 'incident_timeofday' is not null
        #{filter_query(params)}
        group by data ->> 'incident_timeofday'
      }
    end

    def build(current_user, args = {})
      super(current_user, args, &:to_a)
    end
  end
end

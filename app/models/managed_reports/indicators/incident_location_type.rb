# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by incident_location_type
class ManagedReports::Indicators::IncidentLocationType < ManagedReports::SqlReportIndicator
  class << self
    def id
      'incident_location_type'
    end

    def sql(params = {})
      %{
        select
          data->> 'incident_location_type' as id ,
          count(*) as total
        from incidents
        where data->> 'incident_location_type' is not null
        #{date_range_query(params['incident_date'])&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'])&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        group by data ->> 'incident_location_type'
      }
    end

    def build(args = {})
      super(args, &:to_a)
    end
  end
end

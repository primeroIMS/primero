# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by elapsed_reporting_time
# and where the gbv_sexual_violence_type is rape
class ManagedReports::Indicators::ElapsedReportingTimeRape < ManagedReports::SqlReportIndicator
  class << self
    def id
      'elapsed_reporting_time_rape'
    end

    def sql(current_user, params = {})
      %{
        select
          data->> 'elapsed_reporting_time' as id,
          count(*) as total
        from incidents
        where data->> 'elapsed_reporting_time' is not null
        and data ->> 'gbv_sexual_violence_type' = 'rape'
        #{date_range_query(params['incident_date'])&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'])&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by data ->> 'elapsed_reporting_time'
      }
    end

    def build(current_user = nil, args = {})
      super(current_user, args, &:to_a)
    end
  end
end

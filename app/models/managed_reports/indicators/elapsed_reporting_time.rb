# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by elapsed_reporting_time
class ManagedReports::Indicators::ElapsedReportingTime < ManagedReports::SqlReportIndicator
  class << self
    def id
      'elapsed_reporting_time'
    end

    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        select
          data->> 'elapsed_reporting_time' as id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from incidents
        where data->> 'elapsed_reporting_time' is not null
        #{date_range_query(date_param)&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by data ->> 'elapsed_reporting_time'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
      }
    end
  end
end

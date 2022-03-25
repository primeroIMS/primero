# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by the number_of_perpetrators
class ManagedReports::Indicators::NumberOfPerpetrators < ManagedReports::SqlReportIndicator
  class << self
    def id
      'number_of_perpetrators'
    end

    def sql(current_user, params = {})
      date_param = params['incident_date'] || params['date_of_first_report']
      %{
        select
          data ->>'number_of_perpetrators' as id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from incidents
        where data ->>'number_of_perpetrators' is not null
        #{date_range_query(date_param)&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by data ->>'number_of_perpetrators'
        #{grouped_date_query(params['grouped_by'], date_param)&.concat(', ')}
      }
    end
  end
end

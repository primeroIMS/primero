# frozen_string_literal: true

# An indicator that returns the survivors by age
class ManagedReports::Indicators::SurvivorsAge < ManagedReports::SqlReportIndicator
  class << self
    def id
      'age'
    end

    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        select
          #{age_ranges_query} as id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from incidents
        where data ->> 'age' is not null
        #{date_range_query(date_param)&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by #{age_ranges_query}
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
      }
    end
  end
end

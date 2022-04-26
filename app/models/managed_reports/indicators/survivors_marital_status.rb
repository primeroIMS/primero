# frozen_string_literal: true

# An indicator that returns the survivors by marital status
class ManagedReports::Indicators::SurvivorsMaritalStatus < ManagedReports::SqlReportIndicator
  class << self
    def id
      'marital_status'
    end

    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        select
          data ->> 'maritial_status' as id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from incidents
        where data ->> 'maritial_status' is not null
        #{date_range_query(date_param)&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by data ->> 'maritial_status'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(',')}
      }
    end
  end
end

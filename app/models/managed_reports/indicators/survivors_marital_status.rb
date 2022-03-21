# frozen_string_literal: true

# An indicator that returns the survivors by marital status
class ManagedReports::Indicators::SurvivorsMaritalStatus < ManagedReports::SqlReportIndicator
  class << self
    def id
      'marital_status'
    end

    def sql(current_user, params = {})
      %{
        select
          data ->> 'marital_status' as id,
          count(*) as total
        from incidents
        where data ->> 'marital_status' is not null
        #{date_range_query(params['incident_date'])&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'])&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by id
      }
    end

    def build(current_user = nil, args = {})
      super(current_user, args, &:to_a)
    end
  end
end

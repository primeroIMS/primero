# frozen_string_literal: true

# An indicator that returns the survivors by displacement incident
class ManagedReports::Indicators::SurvivorsDisplacementIncident < ManagedReports::SqlReportIndicator
  class << self
    def id
      'displacement_incident'
    end

    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        select
          data ->> 'displacement_incident' as id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from incidents
        where data ->> 'displacement_incident' is not null
        #{date_range_query(date_param)&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by data ->> 'displacement_incident'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
      }
    end
  end
end

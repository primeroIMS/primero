# frozen_string_literal: true

# An indicator that returns the total of incidents where the organization is not the first point of contact
class ManagedReports::Indicators::IncidentsFromOtherServiceProvider < ManagedReports::SqlReportIndicator
  class << self
    def id
      'incidents_from_other_service_provider'
    end

    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        select
        'incidents_from_other_service_provider' as id,
         #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from incidents
        where data ->> 'service_referred_from' <> 'self_referral'
        #{user_scope_query(current_user)&.prepend('and ')}
        #{date_range_query(date_param)&.prepend('and ')}
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
      }
    end
  end
end

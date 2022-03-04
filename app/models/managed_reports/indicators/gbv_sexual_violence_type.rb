# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by gbv_sexual_violence_type
class ManagedReports::Indicators::GBVSexualViolenceType < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_sexual_violence_type'
    end

    def sql(current_user, params = {})
      %{
        select
          data->> 'gbv_sexual_violence_type' as id,
          count(*) as total
        from incidents
        where data->> 'gbv_sexual_violence_type' is not null
        #{date_range_query(params['incident_date'])&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'])&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by data ->> 'gbv_sexual_violence_type'
      }
    end

    def build(current_user = nil, args = {})
      super(current_user, args, &:to_a)
    end
  end
end

# frozen_string_literal: true

# An indicator that returns the total of incidents with a gbv_sexual_violence_type
class ManagedReports::Indicators::TotalGBVSexualViolence < ManagedReports::SqlReportIndicator
  class << self
    def id
      'gbv_sexual_violence'
    end

    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        select
         'gbv_sexual_violence_type' as id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from  incidents
        where data ->> 'gbv_sexual_violence_type' != 'non-gbv'
        and data ->> 'gbv_sexual_violence_type' is not null
        #{date_range_query(date_param)&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
      }
    end
  end
end

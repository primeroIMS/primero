# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of incidents grouped by elapsed_reporting_time
# and where the gbv_sexual_violence_type is rape
class ManagedReports::Indicators::ElapsedReportingTimeRape < ManagedReports::SqlReportIndicator
  class << self
    def id
      'elapsed_reporting_time_rape'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        select
          data->> 'elapsed_reporting_time' as id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from incidents
        where data->> 'elapsed_reporting_time' is not null
        and data ->> 'gbv_sexual_violence_type' = 'rape'
        #{date_range_query(date_param)&.prepend('and ')}
        #{equal_value_query(params['module_id'])&.prepend('and ')}
        #{user_scope_query(current_user)&.prepend('and ')}
        group by data ->> 'elapsed_reporting_time'
        #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
      }
    end
    # rubocop:enable Metrics/MethodLength
  end
end

# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of clients with improved psychosocial wellbeing
class ManagedReports::Indicators::ImprovedWellbeingAfterSupport < ManagedReports::SqlReportIndicator
  class << self
    def id
      'improved_wellbeing_after_support'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        select
          searchable_values.value as id,
          #{grouped_date_query(params['grouped_by'], date_param, 'searchable_datetimes', nil,
                               'value')&.concat(' as group_id,')}
          count(*) as total
        from cases cases
        inner join searchable_values searchable_values
        on cases.id = searchable_values.record_id
        inner join searchable_datetimes searchable_datetimes
        on cases.id = searchable_datetimes.record_id
        where cases.data->>'psychsocial_assessment_score_initial' is not null and
        searchable_values.field_name = 'sex' and
	      searchable_datetimes.field_name = '#{date_param.field_name}' and
        cases.data->>'psychsocial_assessment_score_most_recent' is not null and
        ABS(
          (cases.data ->> 'psychsocial_assessment_score_initial')::INT -
          ( cases.data ->> 'psychsocial_assessment_score_most_recent')::INT
        ) >= 3 and
        (cases.data ->> 'next_steps')::jsonb ? 'a_continue_protection_assessment'
        #{user_scope_query(current_user)&.prepend('and ')}
        #{equal_value_query_multiple(params['status'], 'cases')&.prepend('and ')}
        #{date_range_query(date_param, 'searchable_datetimes', nil, 'value')&.prepend('and ')}
        group by
          searchable_values.value,
          #{grouped_date_query(params['grouped_by'], date_param, 'searchable_datetimes', nil, 'value')}
      }
    end
    # rubocop:enable Metrics/MethodLength
  end
end

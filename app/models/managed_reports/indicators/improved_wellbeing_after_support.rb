class ManagedReports::Indicators::ImprovedWellbeingAfterSupport < ManagedReports::SqlReportIndicator
  class << self
    def id
      'improved_wellbeing_after_support'
    end

    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        select
          reportable_values.value as id,
         #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(*) as total
        from cases cases
        inner join reportable_values reportable_values
        on cases.id = reportable_values.record_id
        where cases.data->>'psychsocial_assessment_score_initial' is not null and
        cases.data->>'psychsocial_assessment_score_most_recent' is not null and
        ABS(
          (cases.data ->> 'psychsocial_assessment_score_initial')::INT -
          ( cases.data ->> 'psychsocial_assessment_score_most_recent')::INT
        ) >= 3 and
        (cases.data ->> 'next_steps')::jsonb ? 'a_continue_protection_assessment'
        #{user_scope_query(current_user)&.prepend('and ')}
        #{date_range_query(date_param)&.prepend('and ')}
        group by
          reportable_values.value
          #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
      }
    end
  end
end

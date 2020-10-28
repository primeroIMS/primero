module KPI
  class AverageFollowupMeetingsPerCase < Search
    def search
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.sanitize_sql_array([%{
          select
            count(gbv_follow_up_subform_sections->>'followup_date') / count(distinct cases.id)::float as average_followup_meetings_per_case
          from
            cases,
            jsonb_array_elements(data->'action_plan_form') action_plan_forms,
            jsonb_array_elements(action_plan_forms->'gbv_follow_up_subform_section') gbv_follow_up_subform_sections
          where
            (gbv_follow_up_subform_sections->>'followup_date')::date >= :from
            and (gbv_follow_up_subform_sections->>'followup_date')::date <= :to
        }, from: from, to: to])
      )
    end

    def to_json
      {
        data: {
          average_meetings: search.to_a&.first['average_followup_meetings_per_case']
        }
      }
    end
  end
end

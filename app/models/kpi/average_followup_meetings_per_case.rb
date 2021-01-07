module KPI
  class AverageFollowupMeetingsPerCase < Search
    def search
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.sanitize_sql_array([%{
          select
            case count(distinct cases.id)
              when 0 then 0
              else count(gbv_follow_up_subform_sections->>'followup_date') / count(distinct cases.id)::float
            end as average_followup_meetings_per_case
          from
            cases,
            jsonb_array_elements(data->'gbv_follow_up_subform_section') gbv_follow_up_subform_sections
          where
            data->>'owned_by_agency_id' = :owned_by_agency_id
            and data->'owned_by_groups' ?| array[:owned_by_groups]
            and (gbv_follow_up_subform_sections->>'followup_date')::date >= :from
            and (gbv_follow_up_subform_sections->>'followup_date')::date <= :to
        }, from: from, to: to, owned_by_groups: owned_by_groups, owned_by_agency_id: owned_by_agency_id])
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

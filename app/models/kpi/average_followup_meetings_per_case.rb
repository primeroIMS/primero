# frozen_string_literal: true

# AverageFollowupMeetingsPerCase
# A Kpi to count the average number of followup up meetings for all
# accessible cases
class Kpi::AverageFollowupMeetingsPerCase < Kpi::Search
  # rubocop:disable Metrics/MethodLength
  def search
    ActiveRecord::Base.connection.execute(
      ActiveRecord::Base.sanitize_sql_array([%{
        with my_cases as (
          select
            *
          from
            cases
          where
            data->>'owned_by_agency_id' = :owned_by_agency_id
            and data->'owned_by_groups' ?| array[:owned_by_groups]
        ), follow_ups as (
          select
            gbv_follow_up_subform_sections->>'unique_id' as unique_id
          from
            my_cases,
            jsonb_array_elements(my_cases.data->'gbv_follow_up_subform_section') gbv_follow_up_subform_sections
          where
            (gbv_follow_up_subform_sections->>'followup_date')::date >= :from
            and (gbv_follow_up_subform_sections->>'followup_date')::date <= :to
        )
        select
          case count(distinct my_cases.id)
            when 0 then 0
            else count(distinct follow_ups.unique_id)::float / count(distinct my_cases.id)::float
          end as average_followup_meetings_per_case
        from
          my_cases,
          follow_ups
      }, from: from, to: to, owned_by_groups: owned_by_groups, owned_by_agency_id: owned_by_agency_id])
    )
  end
  # rubocop:enable Metrics/MethodLength

  def to_json(*_args)
    {
      data: {
        average_meetings: search.to_a&.first&.fetch('average_followup_meetings_per_case', 0.0)
      }
    }
  end
end

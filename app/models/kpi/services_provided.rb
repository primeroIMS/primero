# frozen_string_literal: true

# ServicesProvided
# A Kpi to count how many of each type of service has been provided by an
# agency.
class Kpi::ServicesProvided < Kpi::Search

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
            and (data->>'created_at')::date >= :from
            and (data->>'created_at')::date <= :to
        ), internal_referrals as (
          select distinct
            my_cases.id as id,
            action_plan_section->>'service_type' as service_type,
            my_cases.data->>'sex' as sex,
            (my_cases.data->>'age')::float as age,
            my_cases.data->>'gbv_disability_type' as disability
          from
            my_cases,
            jsonb_array_elements(my_cases.data->'action_plan_section') action_plan_section 
          where
            action_plan_section->>'service_referral' = 'service_provided_by_your_agency'
        )
        select
          service_type,
          count(id) as count,
          sum(case when sex = 'male' then 1 else 0 end) as male,
          sum(case when sex = 'female' then 1 else 0 end) as female,
          sum(case when age <= 11 then 1 else 0 end) as "0-11",
          sum(case when age > 11 and age <= 17 then 1 else 0 end) as "12-17",
          sum(case when age > 17 then 1 else 0 end) as ">18",
          sum(case when disability = 'true' then 1 else 0 end) as disability,
          sum(case when disability is null or disability = 'false' then 1 else 0 end) as no_disability
        from
          internal_referrals
        group by
          service_type
      }, from: from, to: to, owned_by_groups: owned_by_groups, owned_by_agency_id: owned_by_agency_id])
    )
  end

  def data
    @data ||= search.map do |result|
      {
        service: Lookup.display_value('lookup-gbv-service-type', result['service_type']),
        male: result['male'],
        female: result['female'],
        '0-11': result['0-11'],
        '12-17': result['12-17'],
        '>18': result['>18'],
        disability: result['disability'],
        no_disability: result['no_disability'],
        count: result['count']
      }
    end
  end
  # rubocop:enable Metrics/MethodLength

  def to_json(*_args)
    {
      data: {
        services_provided: data
      }
    }
  end
end

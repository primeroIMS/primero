# frozen_string_literal: true

# An indicator that returns the individual age
class ManagedReports::Indicators::IndividualAge < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'individual_age'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    def sql(current_user, params = {})
      date_filter = filter_date(params)

      %{
        select
          #{age_ranges_query('individual_age', 'individual_children', false)} as name,
          'total' as key,
          #{grouped_date_query(params['grouped_by'], date_filter, 'individual_children')&.concat(' as group_id,')}
          count(*) as sum
        from (
          select distinct
            individual_victims_violations.individual_victim_id AS id,
            individual_victims.data ->> 'individual_age' as individual_age,
            jsonb_build_object('incident_date', incidents.data ->> 'incident_date') as data
          from
            violations violations
            inner join incidents incidents
            on incidents.id = violations.incident_id
            inner join individual_victims_violations on violations.id = individual_victims_violations.violation_id
            inner join individual_victims on individual_victims.id = individual_victims_violations.individual_victim_id
            #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
          where
            #{date_range_query(params['incident_date'], 'incidents')}
            #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
            #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
            #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
            #{equal_value_query_multiple(params['violation_type'], 'violations', 'type')&.prepend('and ')}
        ) individual_children
        group by
          #{age_ranges_query('individual_age', 'individual_children', false)},
          name,
          #{grouped_date_query(params['grouped_by'], date_filter, 'individual_children')}
        order by name
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
  end
end

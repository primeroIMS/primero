# frozen_string_literal: true

# An indicator that returns the individual perpetrators
class ManagedReports::Indicators::IndividualPerpetrator < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'individual_perpetrator'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      %{
        select
        name,
        'total' AS KEY,
        #{grouped_date_query(params['grouped_by'],
                             filter_date(params),
                             'individual_perpetrators')&.concat(' as group_id,')}
        count(*) as sum
        from (
          select
            #{table_name_for_query(params)}.data as data,
            perpetrators.data ->> 'armed_force_group_party_name' AS name
          from
            perpetrators perpetrators
            inner join perpetrators_violations on perpetrators.id = perpetrators_violations.perpetrator_id
            inner join violations on violations.id = perpetrators_violations.violation_id
            inner join incidents on violations.incident_id = incidents.id
            inner join individual_victims_violations on violations.id = individual_victims_violations.violation_id
            inner join individual_victims on individual_victims.id = individual_victims_violations.individual_victim_id
            #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
          where
            perpetrators.data ->> 'armed_force_group_party_name' is not null
            #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
            #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
            #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
            #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
            #{equal_value_query_multiple(params['violation_type'], 'violations', 'type')&.prepend('and ')}
        ) as individual_perpetrators
        group by name
        #{grouped_date_query(params['grouped_by'], filter_date(params), 'individual_perpetrators')&.prepend(', ')}
        order by name
      }
    end
    # rubocop:enable Metrics/PerceivedComplexity
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity
  end
end

# frozen_string_literal: true

# An indicator that returns the type of use of violation type Recruitment
class ManagedReports::Indicators::IndividualPerpetrator < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'individual_perpetrator'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      %{
        select
        perpetrators.data ->> 'perpetrator_category' as name, 'total' as key,
        #{grouped_date_query(params['grouped_by'],
                             filter_date(params),
                             table_name_for_query(params))&.concat(' as group_id,')}
        count(*) as sum
        from
        perpetrators perpetrators
        inner join perpetrators_violations on perpetrators.id = perpetrators_violations.perpetrator_id
        inner join violations on violations.id = perpetrators_violations.violation_id
        inner join incidents on violations.incident_id = incidents.id
        #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        where #{date_range_query(params['incident_date'], 'incidents')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        #{equal_value_query_multiple(params['violation_type'], 'violations', 'type')&.prepend('and ')}
        group by perpetrators.data ->> 'perpetrator_category', name
        #{grouped_date_query(params['grouped_by'], filter_date(params), table_name_for_query(params))&.prepend(', ')}
        order by name
      }
    end
   # rubocop:enable Metrics/MethodLength
 end
end

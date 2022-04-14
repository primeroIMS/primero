# frozen_string_literal: true

# An indicator that returns the reporting locations of violation type detention
class ManagedReports::Indicators::DetentionStatus < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'detention_status'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      %{
        select status as name, count(subquery.id) as sum, 'total' as key
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        from (
            select
            iv.id as id,
            #{grouped_date_query(params['grouped_by'],
                                 filter_date(params),
                                 table_name_for_query(params))&.concat(' as group_id,')}
            (
              case
              when (iv."data"->>'deprivation_liberty_end' is not null
                and to_date(iv."data"->>'deprivation_liberty_end', 'YYYY-MM-DD') <= CURRENT_DATE)
              then 'detention_released'
              else 'detention_detained'
              end
            ) as status
                  from violations violations
                  inner join incidents incidents
                    on incidents.id = violations.incident_id
                    #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
                  inner join individual_victims_violations ivv on violations.id = ivv.violation_id
                  inner join individual_victims iv on ivv.individual_victim_id = iv.id
                  WHERE iv."data"->>'length_deprivation_liberty' is not null
                  and (iv.data->>'victim_deprived_liberty_security_reasons') = 'true'
                  #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
                  #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
                  #{date_range_query(params['ctfmr_verified_date'], 'incidents')&.prepend('and ')}
                  #{equal_value_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
                  #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
             ) as subquery
         group by status
         #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
         order by name
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

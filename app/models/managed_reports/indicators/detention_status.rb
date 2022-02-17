# frozen_string_literal: true

# An indicator that returns the reporting locations of violation type killing
class ManagedReports::Indicators::DetentionStatus < ManagedReports::SqlReportIndicator
  class << self
    def id
      'detention_status'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    def sql(_current_user, params = {})
      %{
        select status, count(subquery.id)
        from (
            select
            iv.id as id,
            (
              case
              when (iv."data"->>'deprivation_liberty_end' is not null
                and to_date(iv."data"->>'deprivation_liberty_end', 'YYYY-MM-DD') <= CURRENT_DATE)
              then 'managed_reports.violations.sub_reports.detention_released'
              else 'managed_reports.violations.sub_reports.detention_detained'
              end
            ) as status
                  from violations violations
                  inner join incidents incidents on incidents.id = violations.incident_id
                  inner join individual_victims_violations ivv on violations.id = ivv.violation_id
                  inner join individual_victims iv on ivv.individual_victim_id = iv.id
                  #{incidents_join(params)}
                  WHERE iv."data"->>'length_deprivation_liberty' is not null
                  and (iv.data->>'victim_deprived_liberty_security_reasons')::boolean
                  #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
                  #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
                  #{date_range_query(params['ctfmr_verified_date'], 'incidents')&.prepend('and ')}
                  #{equal_value_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
                  #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
                  #{equal_value_query(params['verified_ctfmr_technical'], 'violations')&.prepend('and ')}
             ) as subquery
         group by status
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize

    def build(current_user, args = {})
      super(current_user, args, &:to_a)
    end
  end
end

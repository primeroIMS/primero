# frozen_string_literal: true

# An indicator that returns the perpetators of violation type killing
class ManagedReports::Indicators::PerpetratorsDetention < ManagedReports::SqlReportIndicator
  class << self
    def id
      'perpetrators'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    def sql(_current_user, params = {})
      %{
        select p."data"->>'armed_force_group_party_name' as id, count(iv.id) as total
        from violations violations
        inner join perpetrators_violations pv on pv.violation_id = violations.id
        inner join individual_victims_violations ivv on violations .id = ivv.violation_id
        inner join individual_victims iv on ivv.individual_victim_id = iv.id
        inner join perpetrators p on p.id = pv.perpetrator_id
        #{incidents_join(params)}
        WHERE p.data->>'armed_force_group_party_name' is not null
        and (iv.data->>'victim_deprived_liberty_security_reasons')::boolean
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['ctfmr_verified_date'], 'incidents')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['verified_ctfmr_technical'], 'violations')&.prepend('and ')}
        group by p."data"->>'armed_force_group_party_name';
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize

    def build(current_user = nil, args = {})
      super(current_user, args, &:to_a)
    end
  end
end

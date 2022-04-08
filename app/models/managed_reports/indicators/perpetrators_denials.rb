# frozen_string_literal: true

# An indicator that returns the perpetators of violation type Denials
class ManagedReports::Indicators::PerpetratorsDenials < ManagedReports::SqlReportIndicator
  class << self
    def id
      'perpetrators'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      %{
        select
          p."data"->>'armed_force_group_party_name' as id,
          count(violations.id) as total
          from violations violations
          inner join perpetrators_violations pv on pv.violation_id = violations.id
          inner join perpetrators p on p.id = pv.perpetrator_id
          inner join incidents incidents
            on incidents.id = violations.incident_id
            #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
          where
          p.data->>'armed_force_group_party_name' is not null
          #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
          #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
          #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
          #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
          #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
        group by p."data"->>'armed_force_group_party_name'
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    def build(current_user = nil, args = {})
      super(current_user, args, &:to_a)
    end
  end
end

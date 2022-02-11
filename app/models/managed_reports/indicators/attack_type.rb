# frozen_string_literal: true

# An indicator that returns the attack type of violation type killing
class ManagedReports::Indicators::AttackType < ManagedReports::SqlReportIndicator
  class << self
    def id
      'attack_type'
    end

    # rubocop:disable Metrics/AbcSize
    def sql(_current_user, params = {})
      %{
        select
          violations."data"->>'attack_type' as id,
          count(violations.id) as total
        from violations violations
        #{incidents_join(params)}
        where violations."data"->>'attack_type' is not null
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['verified_ctfmr_technical'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
        group by violations."data"->>'attack_type';
      }
    end
    # rubocop:enable Metrics/AbcSize

    def build(current_user = nil, args = {})
      super(current_user, args, &:to_a)
    end
  end
end

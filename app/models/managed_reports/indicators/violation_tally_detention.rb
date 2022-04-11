# frozen_string_literal: true

# An indicator that returns the violation_tally of individual victioms - detention
class ManagedReports::Indicators::ViolationTallyDetention < ManagedReports::SqlReportIndicator
  class << self
    def id
      'violation'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    def sql(current_user, params = {})
      %{
        select json_object_agg(key, sum) as data from(
          select key, sum(value::integer) from (
              select distinct on(violations.id, key) key, value
              from individual_victims iv
              inner join individual_victims_violations ivv on ivv.individual_victim_id = iv.id
              inner join violations violations on violations.id = ivv.violation_id
              inner join incidents incidents
                on incidents.id = violations.incident_id
                #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
              cross join json_each_text((violations."data"->>'violation_tally')::JSON)
              where (iv.data->>'victim_deprived_liberty_security_reasons')::boolean
              and violations."data"->>'violation_tally' is not null
              #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
              #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
              #{date_range_query(params['ctfmr_verified_date'], 'incidents')&.prepend('and ')}
              #{equal_value_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
              #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
          ) keys_values
          group by key
      ) as deprived_data;
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity

    def build(current_user = nil, args = {})
      super(current_user, args) do |result|
        ActiveSupport::JSON.decode(result.first.dig('data') || '{}')
      end
    end
  end
end

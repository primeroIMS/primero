# frozen_string_literal: true

# An indicator that returns the violation_tally of individual victioms - detention
class ManagedReports::Indicators::ViolationTallyDetention < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'violation'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      %{
        select json_object_agg(key, sum) as data
          #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')} from(
          select key, sum(value::integer)
            #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')} from (
              select distinct on(violations.id, key) key,
              #{grouped_date_query(params['grouped_by'],
                                   filter_date(params),
                                   table_name_for_query(params))&.concat(' as group_id,')}
              value
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
              #{equal_value_query(params['verified_ctfmr_technical'], 'violations')&.prepend('and ')}
          ) keys_values
          group by key
          #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
      ) as deprived_data
      #{group_id_alias(params['grouped_by'])&.dup&.prepend('group by ')}
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity

    def build_results(results)
      unless results.to_a.any? { |result| result['group_id'].present? }
        return ActiveSupport::JSON.decode(results.to_a.first.dig('data') || '{}')
      end

      results.to_a.map do |result|
        { group_id: result['group_id'], data: ActiveSupport::JSON.decode(result['data']) }
      end
    end
  end
end

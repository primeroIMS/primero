# frozen_string_literal: true

# An indicator that returns the perpetators of individual victioms - detention
class ManagedReports::Indicators::PerpetratorsDetention < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'perpetrator_detention'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      %{
        select * from (
        select distinct on(iv.id) iv.id as id, iv."data"->>'entity_responsible_deprivation_liberty' as name,
        iv.data->>'individual_sex' as key,
        sum(count(iv.id)) over (partition by
          iv."data"->>'entity_responsible_deprivation_liberty', violations.id
          #{grouped_date_query(params['grouped_by'],
                               filter_date(params),
                               table_name_for_query(params))&.prepend(', ')}
        )::integer as total,
        #{grouped_date_query(params['grouped_by'],
                             filter_date(params),
                             table_name_for_query(params))&.concat(' as group_id,')}
        count(iv.id) as sum
        from violations violations
        inner join individual_victims_violations ivv on violations.id = ivv.violation_id
        inner join individual_victims iv on ivv.individual_victim_id = iv.id
        inner join incidents incidents
          on incidents.id = violations.incident_id
          #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        WHERE iv.data->>'entity_responsible_deprivation_liberty' is not null
        and iv.data->>'individual_sex' is not null
        and (iv.data->>'victim_deprived_liberty_security_reasons') = 'yes'
        and iv."data"->'entity_responsible_deprivation_liberty' != '[]'
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        group by key, name, iv.id, violations.id
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        order by iv.id, name) subquery
        order by name
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity

    def build_data_values(values)
      values.each_with_object([]) do |curr, acc|
        current_group = acc.find { |group| group[:id] == curr['name'] }
        next current_group[curr['key'].to_sym] = curr['sum'] if current_group.present?

        acc << { id: curr['name'], curr['key'].to_sym => curr['sum'], total: curr['total'] }
      end
    end
  end
end

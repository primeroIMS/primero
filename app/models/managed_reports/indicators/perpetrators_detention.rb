# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
        with detention as (
          select
            iv.data->>'individual_sex' as key,
            iv.data->>'armed_force_group_party_name' as name,
            #{grouped_date_query(params['grouped_by'],
                                 filter_date(params),
                                 table_name_for_query(params))&.concat(' as group_id,')}
            count(*) as sum
          from individual_victims iv
          inner join individual_victims_violations ivv on iv.id = ivv.individual_victim_id
          inner join violations on violations.id = ivv.violation_id
          inner join incidents incidents
            on incidents.id = violations.incident_id
            #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
          WHERE iv.data->>'armed_force_group_party_name' is not null
          and iv.data->>'individual_sex' is not null
          and (iv.data->>'victim_deprived_liberty_security_reasons') = 'yes'
          and iv."data"->'armed_force_group_party_name' != '[]'
          #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
         #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
         #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
         #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
          group by
            iv.data->>'individual_sex',
            iv.data->>'armed_force_group_party_name'
            #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        )
        select
          *,
          cast(sum(detention.sum) over (partition by name) as integer) as total
        from detention
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

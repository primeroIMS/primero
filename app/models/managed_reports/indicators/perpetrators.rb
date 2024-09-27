# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the perpetators of violation type killing
class ManagedReports::Indicators::Perpetrators < ManagedReports::SqlReportIndicator
  class << self
    def id
      'perpetrators'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      %{
        select name, key, sum(value::integer)
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        from (
          select distinct on(p.id, violations.id, key) key, value,
        #{grouped_date_query(params['grouped_by'],
                             filter_date(params),
                             table_name_for_query(params))&.concat(' as group_id,')}
          p."data"->>'armed_force_group_party_name' as name
          from violations violations
          inner join perpetrators_violations pv on pv.violation_id = violations.id
          inner join perpetrators p on p.id = pv.perpetrator_id
          cross join json_each_text((violations."data"->>'violation_tally')::JSON)
          inner join incidents incidents
            on incidents.id = violations.incident_id
            #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
          where
          p.data->>'armed_force_group_party_name' is not null
          and violations."data"->>'violation_tally' is not null
          #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
          #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
          #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
          #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
          #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
      ) keys_values
      group by key, name
      #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
      order by name
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

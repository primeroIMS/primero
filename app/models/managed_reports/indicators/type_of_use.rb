# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the type of use of violation type Recruitment
class ManagedReports::Indicators::TypeOfUse < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'type_of_use'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      %{
        select name, key, sum(value::integer)
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        from (
        select
          key, value,
          #{grouped_date_query(params['grouped_by'],
                               filter_date(params),
                               table_name_for_query(params))&.concat(' as group_id,')}
          violations."data"->>'child_role' as name
        from violations violations
        inner join incidents incidents
          on incidents.id = violations.incident_id
          #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        cross join json_each_text((violations."data"->>'violation_tally')::JSON)
        where violations.data->>'violation_tally' is not null
        and violations."data"->>'child_role' is not null
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
        ) keys_values
        group by key, name
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        order by name, key
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

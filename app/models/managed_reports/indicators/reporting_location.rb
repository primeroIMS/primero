# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the reporting locations of violation type killing
class ManagedReports::Indicators::ReportingLocation < ManagedReports::SqlReportIndicator
  class << self
    def id
      'reporting_location'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      admin_level = user_reporting_location_admin_level(current_user)

      %{
        select name, key, sum(value::integer)
        #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        from (
            select
            key, value,
            #{grouped_date_query(params['grouped_by'],
                                 filter_date(params),
                                 table_name_for_query(params))&.concat(' as group_id,')}
            (string_to_array(incidents."data" ->> 'reporting_location_hierarchy', '.'))[#{admin_level}] as name
            from violations violations
            inner join incidents incidents
              on incidents.id = violations.incident_id
              #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
            cross join json_each_text((violations."data"->>'violation_tally')::JSON)
            where incidents.data->>'reporting_location_hierarchy' is not null
            and violations."data"->>'violation_tally' is not null
            #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
            #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
            #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
            #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
            #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
            #{equal_value_query(params['has_late_verified_violations'], 'incidents')&.prepend('and ')}
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

    def user_reporting_location_admin_level(current_user)
      # Adding one since admin level start from 0, but string on postgres start from 1
      current_user.role.incident_reporting_location_config&.admin_level.to_i + 1
    end
  end
end

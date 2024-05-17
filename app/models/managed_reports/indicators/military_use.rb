# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the reporting locations of violation type detention
class ManagedReports::Indicators::MilitaryUse < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'military_use_type_of_use'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      %{
        select
          "violations"."data" ->>'military_use_type' as name, 'total' as key,
          #{grouped_date_query(params['grouped_by'],
                               filter_date(params),
                               table_name_for_query(params))&.concat(' as group_id,')}
          count("violations"."data" ->>'military_use_type') as sum
        from violations violations
        inner join incidents incidents
          on incidents.id = violations.incident_id
          #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        where "violations"."data" ->>'military_use_type' is not null
            #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
            #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
            #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
            #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
            #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
        group by
        #{grouped_date_query(params['grouped_by'], filter_date(params), table_name_for_query(params))&.dup&.+(', ')}
        "violations"."data" ->>'military_use_type'
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

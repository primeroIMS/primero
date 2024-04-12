# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the violation_tally of individual victioms - detention
class ManagedReports::Indicators::ViolationTallyDetention < ManagedReports::SqlReportIndicator
  include ManagedReports::MRMIndicatorHelper

  class << self
    def id
      'children'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      %{
          select subquery.key as name, count(subquery.id) as sum, 'total' as key
            #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')} from (
              select distinct on(iv.id) iv.id as id,
              #{grouped_date_query(params['grouped_by'],
                                   filter_date(params),
                                   table_name_for_query(params))&.concat(' as group_id,')}
              iv.data->>'individual_sex' as key
              from individual_victims iv
              inner join individual_victims_violations ivv on ivv.individual_victim_id = iv.id
              inner join violations violations on violations.id = ivv.violation_id
              inner join incidents incidents
                on incidents.id = violations.incident_id
                #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
              where (iv.data->>'victim_deprived_liberty_security_reasons') = 'yes'
              and iv.data->>'individual_sex' is not null
              #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
              #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
              #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
              #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
          ) as subquery
          group by key
          #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
          order by
          #{group_id_alias(params['grouped_by'])&.dup&.+(',')}
          name
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

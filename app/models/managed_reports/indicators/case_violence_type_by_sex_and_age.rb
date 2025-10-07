# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total cases by workflow and sex
class ManagedReports::Indicators::CaseViolenceTypeBySexAndAge < ManagedReports::SqlReportIndicator
  class << self
    def id
      'case_violence_type_by_sex_and_age'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
          with case_violence_type_by_sex_and_age as (
            select
              cases.data->> 'sex' as name,
              #{age_ranges_query(field_name: 'age', table_name: 'cases', module_id: params['module_id'])} as key,
              #{grouped_date_query(params['grouped_by'], filter_date(params), 'cases')&.concat(' as group_id,')}
              count(*) as sum
            from cases
            where cases.id in (
              select
                incident_case_id
              from incidents
              where incident_case_id is not null
              #{equal_value_query(params['cp_incident_violence_type'], 'incidents')&.prepend('and ')}
            )
            #{equal_value_query_multiple(params['owned_by_groups'], 'cases')&.prepend('and ')}
            #{equal_value_query_multiple(params['created_by_groups'], 'cases')&.prepend('and ')}
            #{equal_value_query_multiple(params['owned_by_agency_id'], 'cases')&.prepend('and ')}
            #{equal_value_query_multiple(params['created_organization'], 'cases')&.prepend('and ')}
            #{equal_value_query_multiple(params['status'], 'cases')&.prepend('and ')}
            #{date_range_query(date_param, 'cases')&.prepend('and ')}
            #{equal_value_query(params['module_id'], 'cases')&.prepend('and ')}
            #{user_scope_query(current_user, 'cases')&.prepend('and ')}
            group by name, key
              #{grouped_date_query(params['grouped_by'], date_param, 'cases')&.prepend(', ')}
            order by name, key
          )
          select
            name, key, sum #{params['grouped_by'].present? ? ', group_id' : ''}
          from case_violence_type_by_sex_and_age
          union all
          select
            name,
            'total' as key,
            cast(sum(sum) as integer) as sum
            #{params['grouped_by'].present? ? ', group_id' : ''}
          from case_violence_type_by_sex_and_age
          group by name #{params['grouped_by'].present? ? ', group_id' : ''}
          union all
          select
           'total' as name,
            key,
            cast(sum(sum) as integer) as sum
            #{params['grouped_by'].present? ? ', group_id' : ''}
          from case_violence_type_by_sex_and_age
          group by key #{params['grouped_by'].present? ? ', group_id' : ''}
          union all
          select
           'total' as name,
           'total' as key,
           cast(sum(sum) as integer) as sum
           #{params['grouped_by'].present? ? ', group_id' : ''}
          from case_violence_type_by_sex_and_age
          #{params['grouped_by'].present? ? 'group by group_id' : ''}
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

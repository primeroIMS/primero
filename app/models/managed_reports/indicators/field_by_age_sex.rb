# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total cases by a specified field, age and sex
class ManagedReports::Indicators::FieldByAgeSex < ManagedReports::SqlReportIndicator
  class << self
    def id
      raise NotImplementedError
    end

    def field_name
      raise NotImplementedError
    end

    def multiple_field_values
      false
    end

    def reporting_location_field?
      false
    end

    def field_value(field_param)
      return if reporting_location_field?

      return equal_value_query_multiple(field_param) if multiple_field_values

      equal_value_query(field_param)
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
          with #{id}_by_sex_and_age as (
            select
              data->> 'sex' as name,
              #{age_ranges_query(module_id: params['module_id'])} as key,
              #{grouped_date_query(params['grouped_by'], filter_date(params))&.concat(' as group_id,')}
              count(*) as sum
            from cases
            where 1 = 1
            #{equal_value_query_multiple(params['owned_by_groups'])&.prepend('and ')}
            #{equal_value_query_multiple(params['created_by_groups'])&.prepend('and ')}
            #{equal_value_query_multiple(params['owned_by_agency_id'])&.prepend('and ')}
            #{equal_value_query_multiple(params['created_organization'])&.prepend('and ')}
            #{equal_value_query_multiple(params['status'])&.prepend('and ')}
            #{date_range_query(date_param)&.prepend('and ')}
            #{equal_value_query(params['module_id'])&.prepend('and ')}
            #{field_value(params[field_name])&.prepend('and ')}
            #{user_scope_query(current_user)&.prepend('and ')}
            #{reporting_location_query(params['location'], field_name)&.prepend('and ')}
            group by name, key
              #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
            order by name, key
          )
          select
            name, key, sum #{params['grouped_by'].present? ? ', group_id' : ''}
          from #{id}_by_sex_and_age
          union all
          select
            name,
            'total' as key,
            cast(sum(sum) as integer) as sum
            #{params['grouped_by'].present? ? ', group_id' : ''}
          from #{id}_by_sex_and_age
          group by name #{params['grouped_by'].present? ? ', group_id' : ''}
          union all
          select
           'total' as name,
            key,
            cast(sum(sum) as integer) as sum
            #{params['grouped_by'].present? ? ', group_id' : ''}
          from #{id}_by_sex_and_age
          group by key #{params['grouped_by'].present? ? ', group_id' : ''}
          union all
          select
           'total' as name,
           'total' as key,
           cast(sum(sum) as integer) as sum
           #{params['grouped_by'].present? ? ', group_id' : ''}
          from #{id}_by_sex_and_age
          #{params['grouped_by'].present? ? 'group by group_id' : ''}
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

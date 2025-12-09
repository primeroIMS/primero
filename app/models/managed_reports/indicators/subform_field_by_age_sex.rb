# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total cases by a specified field, age and sex
class ManagedReports::Indicators::SubformFieldByAgeSex < ManagedReports::SqlReportIndicator
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

    def subform_section; end

    def date_filter_nested?
      false
    end

    def field_value(field_param)
      return equal_value_query_multiple(field_param, 'subform_section', nil) if multiple_field_values

      equal_value_query(field_param, 'subform_section', nil)
    end

    def date_value_query(date_param)
      return date_range_query(date_param, 'subform_section') if date_filter_nested?

      date_range_query(date_param, 'cases')
    end

    def field_grouped_date_query(grouped_by_param, date_param)
      return grouped_date_query(grouped_by_param, date_param, 'subform_section') if date_filter_nested?

      grouped_date_query(grouped_by_param, date_param, 'cases')
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)

      <<~SQL
        WITH #{id}_by_sex_and_age AS (
          SELECT
            cases.data->> 'sex' AS name,
            #{age_ranges_query(module_id: params['module_id'], table_name: 'cases')} AS key,
            #{field_grouped_date_query(params['grouped_by'], filter_date(params))&.concat(' AS group_id,')}
            COUNT(*) AS sum
          FROM cases
          CROSS JOIN LATERAL (
            SELECT JSONB_ARRAY_ELEMENTS(cases.data -> '#{subform_section}') AS data
          ) AS subform_section
          WHERE cases.srch_record_state = TRUE
          #{equal_value_query_multiple(params['owned_by_groups'], 'cases')&.prepend('AND ')}
          #{equal_value_query_multiple(params['created_by_groups'], 'cases')&.prepend('AND ')}
          #{equal_value_query_multiple(params['owned_by_agency_id'], 'cases')&.prepend('AND ')}
          #{equal_value_query_multiple(params['created_organization'], 'cases')&.prepend('AND ')}
          #{equal_value_query_multiple(params['status'], 'cases')&.prepend('AND ')}
          #{date_value_query(date_param)&.prepend('AND ')}
          #{equal_value_query(params['module_id'], 'cases')&.prepend('AND ')}
          #{field_value(params[field_name])&.prepend('AND ')}
          #{user_scope_query(current_user, 'cases')&.prepend('AND ')}
          GROUP BY name, key #{field_grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
          ORDER BY name, key
        )
        SELECT
          name, key, sum #{params['grouped_by'].present? ? ', group_id' : ''}
        FROM #{id}_by_sex_and_age
        UNION ALL
        SELECT
          name,
          'total' AS key,
          CAST(SUM(sum) AS INTEGER) AS sum
          #{params['grouped_by'].present? ? ', group_id' : ''}
        FROM #{id}_by_sex_and_age
        GROUP BY name #{params['grouped_by'].present? ? ', group_id' : ''}
        UNION ALL
        SELECT
          'total' AS name,
          key,
          CAST(SUM(sum) AS INTEGER) AS sum
          #{params['grouped_by'].present? ? ', group_id' : ''}
        FROM #{id}_by_sex_and_age
        GROUP BY key #{params['grouped_by'].present? ? ', group_id' : ''}
        UNION ALL
        SELECT
          'total' AS name,
          'total' AS key,
          CAST(SUM(sum) AS INTEGER) AS sum
          #{params['grouped_by'].present? ? ', group_id' : ''}
        FROM #{id}_by_sex_and_age
        #{params['grouped_by'].present? ? 'group by group_id' : ''}
      SQL
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

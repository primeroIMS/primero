# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of cases by risk level
class ManagedReports::Indicators::PercentageCasesRiskLevel < ManagedReports::SqlReportIndicator
  class << self
    def id
      'percentage_cases_risk_level'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      date_query = grouped_date_query(params['grouped_by'], date_param, 'searchable_datetimes', nil, 'value')
      group_id = date_query.present? ? 'group_id' : nil

      %(
        WITH protection_assessment_cases AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            next_steps.record_id,
            sex_values.value AS sex
          FROM searchable_values AS next_steps
          #{join_searchable_sex_values}
          #{join_searchable_datetimes(date_param)}
          #{join_searchable_statuses(params['status'])}
          #{join_reporting_locations(params['location'])}
          #{join_searchable_scope(current_user)}
          WHERE next_steps.record_type = 'Child'
          AND next_steps.field_name = 'next_steps'
          AND next_steps.value = 'a_continue_protection_assessment'
        ),
        total_cases_by_groups AS (
          SELECT
            #{group_id.present? ? 'GROUPING(group_id) by_group_id,' : nil}
            GROUPING(#{group_id&.+(',')} sex) by_group_id_sex,
            #{group_id&.+(',')}
            sex,
            CAST(COUNT(*) AS DECIMAL) AS total
          FROM protection_assessment_cases
          GROUP BY GROUPING SETS(
            #{group_id.present? ? '(group_id),' : '(),'}
            (#{group_id&.+(',')} sex)
          )
        ),
        risk_level_cases AS (
          SELECT
            protection_assessment_cases.*,
            risk_levels.value AS risk_level
          FROM protection_assessment_cases
          INNER JOIN searchable_values AS risk_levels
            ON protection_assessment_cases.record_id = risk_levels.record_id
            AND risk_levels.field_name = 'risk_level'
            AND risk_levels.record_type = 'Child'
        )
        SELECT
          #{group_id&.+(',')}
          risk_level AS name,
          sex AS key,
          ROUND(
            (COUNT(*) * 100) / (
              SELECT
                total
              FROM total_cases_by_groups
              WHERE total_cases_by_groups.sex = risk_level_cases.sex
              #{group_id.present? ? 'AND total_cases_by_groups.group_id = risk_level_cases.group_id' : nil}
            ),
            2
          ) AS sum,
          ROUND(
            SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} risk_level) * 100 / (
              SELECT
                total
              FROM total_cases_by_groups
              WHERE total_cases_by_groups.by_group_id_sex >= 1
              #{group_id.present? ? 'AND total_cases_by_groups.group_id = risk_level_cases.group_id' : nil}
            ),
            2
          ) AS total
        FROM risk_level_cases
        GROUP BY #{group_id&.+(',')} risk_level, sex
      )
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity

    def join_searchable_datetimes(date_param)
      return unless date_param.present?

      %(
        INNER JOIN searchable_datetimes searchable_datetimes
        ON next_steps.record_id = searchable_datetimes.record_id
        AND searchable_datetimes.record_type = 'Child'
        #{searchable_date_range_query(date_param)&.prepend('AND ')}
      )
    end

    def join_searchable_statuses(status_param)
      status_query = searchable_equal_value_multiple(status_param)
      return unless status_query.present?

      %(
        INNER JOIN (
          SELECT record_id FROM searchable_values
          WHERE searchable_values.record_type = 'Child'
          AND #{status_query}
        ) AS statuses ON statuses.record_id = next_steps.record_id
      )
    end

    def join_searchable_sex_values
      %(
        INNER JOIN searchable_values AS sex_values
        ON sex_values.record_id = next_steps.record_id
        AND sex_values.record_type = 'Child'
        AND sex_values.field_name = 'sex'
      )
    end

    def join_searchable_scope(current_user)
      scope_query = searchable_user_scope_query(current_user)
      return unless scope_query.present?

      %(
        INNER JOIN (
          SELECT DISTINCT(record_id)
          FROM searchable_values
          WHERE searchable_values.record_type = 'Child'
          AND #{scope_query}
        ) AS scope_ids ON scope_ids.record_id = next_steps.record_id
      )
    end

    def join_reporting_locations(location_param)
      reporting_location_query = searchable_reporting_location_query(location_param, 'Child', 'owned_by_location')
      return unless reporting_location_query.present?

      %(
        INNER JOIN (#{reporting_location_query}) AS location_record_ids
        ON location_record_ids.record_id = next_steps.record_id
      )
    end
  end
end

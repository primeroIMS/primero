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
      next_step = 'a_continue_protection_assessment'

      %(
        WITH protection_assessment_cases AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            cases.id AS id,
            COALESCE(data->>'gender', 'incomplete_data') AS gender
          FROM cases
          #{ManagedReports::SearchableFilterService.filter_datetimes(date_param)}
          #{ManagedReports::SearchableFilterService.filter_values(params['status'])}
          #{ManagedReports::SearchableFilterService.filter_reporting_location(params['location'])}
          #{ManagedReports::SearchableFilterService.filter_scope(current_user)}
          #{ManagedReports::SearchableFilterService.filter_next_steps(next_step)}
          #{ManagedReports::SearchableFilterService.filter_consent_reporting}
        ),
        total_cases_by_groups AS (
          SELECT
            #{group_id.present? ? 'GROUPING(group_id) by_group_id,' : nil}
            GROUPING(#{group_id&.+(',')} gender) by_group_id_gender,
            #{group_id&.+(',')}
            gender,
            CAST(COUNT(*) AS DECIMAL) AS total
          FROM protection_assessment_cases
          GROUP BY GROUPING SETS(
            #{group_id.present? ? '(group_id),' : '(),'}
            (#{group_id&.+(',')} gender)
          )
        ),
        risk_level_cases AS (
          SELECT
            protection_assessment_cases.*,
            risk_levels.value AS risk_level
          FROM protection_assessment_cases
          INNER JOIN searchable_values AS risk_levels
            ON protection_assessment_cases.id = risk_levels.record_id
            AND risk_levels.field_name = 'risk_level'
            AND risk_levels.record_type = 'Child'
        )
        SELECT
          #{group_id&.+(',')}
          risk_level AS name,
          gender AS key,
          ROUND(
            (COUNT(*) * 100) / (
              SELECT
                total
              FROM total_cases_by_groups
              WHERE total_cases_by_groups.gender = risk_level_cases.gender
              #{group_id.present? ? 'AND total_cases_by_groups.group_id = risk_level_cases.group_id' : nil}
            ),
            2
          ) AS sum,
          ROUND(
            SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} risk_level) * 100 / (
              SELECT
                total
              FROM total_cases_by_groups
              WHERE total_cases_by_groups.by_group_id_gender >= 1
              #{group_id.present? ? 'AND total_cases_by_groups.group_id = risk_level_cases.group_id' : nil}
            ),
            2
          ) AS total
        FROM risk_level_cases
        GROUP BY #{group_id&.+(',')} risk_level, gender
      )
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
  end
end

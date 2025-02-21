# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns % of cases by protection risk
class ManagedReports::Indicators::PercentageCasesProtectionRisk < ManagedReports::SqlReportIndicator
  class << self
    def id
      'percentage_cases_protection_risk'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      date_query = grouped_date_query(params['grouped_by'], date_param, 'searchable_datetimes', nil, 'value')
      group_id = date_query.present? ? 'group_id' : nil
      filter_ops = { table_name: 'sex_values', field_name: 'record_id' }
      next_step = 'a_continue_protection_assessment'

      %(
        WITH protection_assessment_cases AS (
          SELECT
            #{date_query&.+(' AS group_id,')}
            sex_values.record_id,
            sex_values.value AS sex
          FROM searchable_values AS sex_values
          #{ManagedReports::SearchableFilterService.filter_datetimes(date_param, filter_ops)}
          #{ManagedReports::SearchableFilterService.filter_values(params['status'], filter_ops)}
          #{ManagedReports::SearchableFilterService.filter_reporting_location(params['location'], filter_ops)}
          #{ManagedReports::SearchableFilterService.filter_scope(current_user, filter_ops)}
          #{ManagedReports::SearchableFilterService.filter_next_steps(next_step, filter_ops)}
          #{ManagedReports::SearchableFilterService.filter_consent_reporting(filter_ops)}
          WHERE sex_values.record_type = 'Child'
          AND sex_values.field_name = 'sex'
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
        protection_risks_cases AS (
          SELECT
            protection_assessment_cases.*,
            protection_risks.value as protection_risk
          FROM protection_assessment_cases
          #{join_searchable_protection_risks}
        )
        SELECT
          #{group_id&.+(',')}
          protection_risk AS name,
          sex AS key,
          ROUND(
            (COUNT(*) * 100) / (
              SELECT
                total
              FROM total_cases_by_groups
              WHERE total_cases_by_groups.sex = protection_risks_cases.sex
              #{group_id.present? ? 'AND total_cases_by_groups.group_id = protection_risks_cases.group_id' : nil}
            ),
            2
          ) AS sum,
          ROUND(
            SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} protection_risk) * 100 / (
              SELECT
                total
              FROM total_cases_by_groups
              WHERE total_cases_by_groups.by_group_id_sex >= 1
              #{group_id.present? ? 'AND total_cases_by_groups.group_id = protection_risks_cases.group_id' : nil}
            ),
            2
          ) AS total
        FROM protection_risks_cases
        GROUP BY #{group_id&.+(',')} protection_risk, sex
      )
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity

    def join_searchable_protection_risks
      %(
         INNER JOIN searchable_values AS protection_risks
         ON protection_risks.record_id = protection_assessment_cases.record_id
         AND protection_risks.record_type = 'Child'
         AND protection_risks.field_name = 'protection_risks'
      )
    end
  end
end

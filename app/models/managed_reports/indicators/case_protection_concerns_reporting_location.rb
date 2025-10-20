# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# An indicator that returns the total of cases by reporting location
class ManagedReports::Indicators::CaseProtectionConcernsReportingLocation < ManagedReports::SqlReportIndicator
  class << self
    def id
      'case_protection_concerns_reporting_location'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      date_group_query = build_date_group(params, {}, Child)
      group_id = date_group_query.present? ? 'group_id' : nil
      %(
        WITH cases_in_scope AS (
          SELECT
            #{date_group_query&.+(' AS group_id,')}
            COALESCE(
              #{reporting_location_from_hierarchy(current_user)},
              'incomplete_data'
            ) AS reporting_location,
            COALESCE(srch_sex, 'incomplete_data') AS sex
          FROM cases
          WHERE srch_protection_concerns IS NOT NULL
          #{user_scope_query(current_user, 'cases')&.prepend('AND ')}
          #{date_param&.query(Child)&.prepend('AND ')}
          #{params['age']&.query(Child)&.prepend('AND ')}
          #{params['protection_concerns']&.query(Child)&.prepend('AND ')}
        )
        SELECT
          #{group_id&.+(',')}
          reporting_location AS name,
          sex AS key,
          COUNT(*) AS sum,
          CAST(
            SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} reporting_location)
            AS INTEGER
          ) AS total
        FROM cases_in_scope
        GROUP BY #{group_id&.+(',')} reporting_location, sex
      )
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

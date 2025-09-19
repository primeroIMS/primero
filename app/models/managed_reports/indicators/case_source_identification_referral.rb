# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the total of cases by source indentification
class ManagedReports::Indicators::CaseSourceIdentificationReferral < ManagedReports::SqlReportIndicator
  class << self
    def id
      'case_source_identification_referral'
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
            data->>'source_identification_referral' AS source_identification_referral,
            COALESCE(data->>'sex', 'incomplete_data') AS sex
          FROM cases
          WHERE data @? '$[*] ? (exists(@.source_identification_referral) && @.source_identification_referral != null)'
          #{user_scope_query(current_user, 'cases')&.prepend('AND ')}
          #{date_param&.query(Child)&.prepend('AND ')}
          #{params['age']&.query(Child)&.prepend('AND ')}
          #{params['protection_concerns']&.query(Child)&.prepend('AND ')}
        )
        SELECT
          #{group_id&.+(',')}
          source_identification_referral AS name,
          sex AS key,
          COUNT(*) AS sum,
          CAST(
            SUM(COUNT(*)) OVER (PARTITION BY #{group_id&.+(',')} source_identification_referral)
            AS INTEGER
          ) AS total
        FROM cases_in_scope
        GROUP BY #{group_id&.+(',')} source_identification_referral, sex
      )
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

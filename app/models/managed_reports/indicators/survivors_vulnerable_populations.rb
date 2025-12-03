# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the incidents for vulnerable populations
class ManagedReports::Indicators::SurvivorsVulnerablePopulations < ManagedReports::SqlReportIndicator
  class << self
    def id
      'vulnerable_populations'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      grouped_query = grouped_date_query(params['grouped_by'], date_param)
      group_column = grouped_query.present? ? 'group_id' : nil
      <<~SQL
        WITH filtered_incidents AS (
          SELECT
            id,
            #{grouped_query&.dup&.concat(' AS group_id,')}
            data
          FROM incidents
          WHERE srch_record_state = TRUE
          AND data @? '$[*] ? (@.consent_reporting  == "true")'
          #{date_range_query(date_param)&.prepend('AND ')}
          #{equal_value_query(params['module_id'])&.prepend('AND ')}
          #{user_scope_query(current_user)&.prepend('AND ')}
        )
        SELECT
          *
        FROM (
          SELECT
            'survivors_disability_type' AS id,
            #{group_column&.dup&.+(',')}
            COUNT(*) AS total
          FROM filtered_incidents
          WHERE data @? '$[*] ? (@.disability_type == "true")'
          #{group_column&.dup&.prepend('GROUP BY ')}
          UNION
          SELECT
            data ->> 'unaccompanied_separated_status' AS id,
            #{group_column&.dup&.+(',')}
            COUNT(*) AS total
          FROM filtered_incidents
          WHERE data @? '$[*] ? (
            @.unaccompanied_separated_status != null &&
            @.unaccompanied_separated_status != "no"
          )'
          GROUP BY data ->> 'unaccompanied_separated_status' #{group_column&.dup&.prepend(',')}
        ) AS survivors
        ORDER BY id
      SQL
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

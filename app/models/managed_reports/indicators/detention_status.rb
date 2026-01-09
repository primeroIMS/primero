# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the reporting locations of violation type detention
class ManagedReports::Indicators::DetentionStatus < ManagedReports::SqlReportIndicator
  class << self
    def id
      'detention_status'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      <<~SQL
        SELECT
          #{grouped_date_query(params['grouped_by'],
                               filter_date(params),
                               table_name_for_query(params))&.concat(' AS group_id,')}
          CASE
            WHEN violations.data @? '$[*] ? (
              @.deprivation_liberty_end_date != null && @.deprivation_liberty_date_range == true
            )'
            THEN 'detention_released'
            ELSE 'detention_detained'
          END AS name,
          violation_tally.key AS key,
          SUM(violation_tally.value::INT) AS sum
        FROM violations violations
        INNER JOIN incidents incidents
          ON incidents.id = violations.incident_id
          AND incidents.srch_status = 'open'
          AND incidents.srch_record_state = TRUE
          #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
        CROSS JOIN JSONB_EACH_TEXT(violations.data->'violation_tally') AS violation_tally
        WHERE violations.data @? '$.type ? (@ == "deprivation_liberty")'
        AND violations.data @? '$[*] ? (exists(@.violation_tally) && @.violation_tally != null)'
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('AND ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('AND ')}
        #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('AND ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('AND ')}
        #{equal_value_query(params['type'], 'violations')&.prepend('AND ')}
        GROUP BY name, key
        #{grouped_date_query(params['grouped_by'], filter_date(params), table_name_for_query(params))&.prepend(', ')}
        ORDER BY
        #{group_id_alias(params['grouped_by'])&.dup&.+(',')}
        name, key
      SQL
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

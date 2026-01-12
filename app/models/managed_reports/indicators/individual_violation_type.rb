# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the individual violation types
class ManagedReports::Indicators::IndividualViolationType < ManagedReports::SqlReportIndicator
  class << self
    def id
      'individual_violation_type'
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      <<~SQL
        SELECT
          violations.data ->> 'type' AS name,
          'total' AS key,
          #{grouped_date_query(params['grouped_by'],
                               filter_date(params),
                               table_name_for_query(params))&.concat(' AS group_id,')}
        COUNT(*) AS sum
        FROM violations violations
        INNER JOIN incidents incidents
          ON incidents.id = violations.incident_id
          AND incidents.srch_status = 'open'
          AND incidents.srch_record_state = TRUE
        INNER JOIN individual_victims_violations ON violations.id = individual_victims_violations.violation_id
        INNER JOIN individual_victims ON individual_victims.id = individual_victims_violations.individual_victim_id
        #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
        WHERE violations.data ->> 'type' IS NOT NULL
        AND violations.data @? '$[*] ? (@.type != "deprivation_liberty")'
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('AND ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('AND ')}
        #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('AND ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('AND ')}
        #{equal_value_query_multiple(params['violation_type'], 'violations', 'data', 'type')&.prepend('AND ')}
        GROUP BY violations.data ->> 'type', name
        #{grouped_date_query(params['grouped_by'], filter_date(params), table_name_for_query(params))&.prepend(', ')}
        ORDER BY name
      SQL
    end
    # rubocop:enable Metrics/PerceivedComplexity
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
  end
end

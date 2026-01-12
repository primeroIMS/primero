# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the individual perpetrators
class ManagedReports::Indicators::IndividualPerpetrator < ManagedReports::SqlReportIndicator
  class << self
    def id
      'individual_perpetrator'
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      <<~SQL
        SELECT
          name,
          'total' AS KEY,
          #{grouped_date_query(params['grouped_by'],
                               filter_date(params),
                               'individual_perpetrators')&.concat(' AS group_id,')}
          COUNT(*) AS sum
        FROM (
          SELECT
            #{table_name_for_query(params)}.data AS data,
            perpetrators.data ->> 'armed_force_group_party_name' AS name
          FROM
            perpetrators perpetrators
            INNER JOIN perpetrators_violations ON perpetrators.id = perpetrators_violations.perpetrator_id
            INNER JOIN violations
              ON violations.id = perpetrators_violations.violation_id
              AND violations.data @? '$[*] ? (@.type != "deprivation_liberty")'
            INNER JOIN incidents
              ON violations.incident_id = incidents.id
              AND incidents.srch_status = 'open'
              AND incidents.srch_record_state = TRUE
            INNER JOIN individual_victims_violations ON violations.id = individual_victims_violations.violation_id
            INNER JOIN individual_victims ON individual_victims.id = individual_victims_violations.individual_victim_id
            #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
          WHERE perpetrators.data ->> 'armed_force_group_party_name' IS NOT NULL
          #{date_range_query(params['incident_date'], 'incidents')&.prepend('AND ')}
          #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('AND ')}
          #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('AND ')}
          #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('AND ')}
          #{equal_value_query_multiple(params['violation_type'], 'violations', 'data', 'type')&.prepend('AND ')}
        ) AS individual_perpetrators
        group by name
        #{grouped_date_query(params['grouped_by'], filter_date(params), 'individual_perpetrators')&.prepend(', ')}
        order by name
      SQL
    end
    # rubocop:enable Metrics/PerceivedComplexity
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
  end
end

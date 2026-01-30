# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the individual age
class ManagedReports::Indicators::IndividualAge < ManagedReports::SqlReportIndicator
  class << self
    def id
      'individual_age'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_filter = filter_date(params)

      <<~SQL
        SELECT
          #{age_ranges_query(field_name: 'individual_age',
                             table_name: 'individual_children', is_json_field: false,
                             module_id: params['module_id'])} AS name,
          'total' AS key,
          #{grouped_date_query(params['grouped_by'], date_filter, 'individual_children')&.concat(' AS group_id,')}
          COUNT(*) AS sum
        FROM (
          SELECT DISTINCT
            individual_victims_violations.individual_victim_id AS id,
            individual_victims.data ->> 'individual_age' AS individual_age,
            #{table_name_for_query(params)}.data AS data
          FROM violations violations
          INNER JOIN incidents incidents
            ON incidents.id = violations.incident_id
            AND incidents.srch_status = 'open'
            AND incidents.srch_record_state = TRUE
            #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
          INNER JOIN individual_victims_violations ON violations.id = individual_victims_violations.violation_id
          INNER JOIN individual_victims ON individual_victims.id = individual_victims_violations.individual_victim_id
          WHERE individual_victims.data ->> 'individual_age' IS NOT NULL
          AND violations.data @? '$[*] ? (@.type != "deprivation_liberty")'
          #{date_range_query(params['incident_date'], 'incidents')&.prepend('AND ')}
          #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('AND ')}
          #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('AND ')}
          #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('AND ')}
          #{equal_value_query_multiple(params['violation_type'], 'violations', 'data', 'type')&.prepend('AND ')}
        ) individual_children
        GROUP BY
          #{age_ranges_query(
            field_name: 'individual_age',
            table_name: 'individual_children',
            is_json_field: false, module_id: params['module_id']
          )&.+(',')}
          #{grouped_date_query(params['grouped_by'], date_filter, 'individual_children')&.+(',')}
          name
        ORDER BY name
      SQL
    end
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

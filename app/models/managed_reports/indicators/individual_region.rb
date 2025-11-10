# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the individual region
class ManagedReports::Indicators::IndividualRegion < ManagedReports::SqlReportIndicator
  class << self
    def id
      'individual_region'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_filter = filter_date(params)
      date_group_query = grouped_date_query(params['grouped_by'], date_filter, 'violations_in_scope')
      group_id = date_group_query.present? ? 'group_id' : nil

      %{
        WITH violations_in_scope AS (
          SELECT
            violations.id,
            #{table_name_for_query(params)}.data AS data,
            #{incident_region_query(current_user)} AS region
          FROM violations
          INNER JOIN incidents
            ON violations.incident_id = incidents.id
            AND incidents.srch_status = 'open'
          WHERE incidents.data ->> 'reporting_location_hierarchy' IS NOT NULL
          #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
          #{date_range_query(params['incident_date'], 'incidents')&.prepend('AND ')}
          #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('AND ')}
          #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('AND ')}
          #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('AND ')}
          #{equal_value_query_multiple(params['violation_type'], 'violations', 'data', 'type')&.prepend('AND ')}
        ),
        individual_children AS (
          SELECT
            #{date_group_query&.concat(' AS group_id,')}
            individual_victims.id,
            region
          FROM violations_in_scope
          INNER JOIN individual_victims_violations
            ON violations_in_scope.id = individual_victims_violations.violation_id
          INNER JOIN individual_victims
            ON individual_victims.id = individual_victims_violations.individual_victim_id
          GROUP BY #{group_id&.+(',')} individual_victims.id, region
        )
        SELECT
          #{group_id&.+(',')}
          region AS name,
          'total' AS key,
          COUNT(*) AS sum
        FROM individual_children
        GROUP BY #{group_id&.+(',')} region
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

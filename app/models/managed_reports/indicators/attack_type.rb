# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the attack type of violation type killing
class ManagedReports::Indicators::AttackType < ManagedReports::SqlReportIndicator
  class << self
    def id
      'attack_type'
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      <<~SQL
        SELECT
          name,
          key,
          SUM(value::INTEGER)
          #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        FROM (
          SELECT
            key,
            value,
            #{grouped_date_query(params['grouped_by'],
                                 filter_date(params),
                                 table_name_for_query(params))&.concat(' AS group_id,')}
            violations."data"->>'weapon_type' AS name
          FROM violations violations
          INNER JOIN incidents incidents
          ON incidents.id = violations.incident_id
          AND incidents.srch_status = 'open'
          AND incidents.srch_record_state = TRUE
          #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
          CROSS JOIN JSONB_EACH_TEXT((violations."data"->'violation_tally'))
          WHERE violations."data"->>'weapon_type' IS NOT NULL
          AND violations."data"->>'violation_tally' IS NOT NULL
          #{date_range_query(params['incident_date'], 'incidents')&.prepend('AND ')}
          #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('AND ')}
          #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('AND ')}
          #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('AND ')}
          #{equal_value_query(params['type'], 'violations')&.prepend('AND ')}
          #{equal_value_query(params['has_late_verified_violations'], 'incidents')&.prepend('AND ')}
        ) keys_values
        GROUP BY key, name #{group_id_alias(params['grouped_by'])&.dup&.prepend(', ')}
        ORDER BY name
      SQL
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

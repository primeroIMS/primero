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
      %{
        SELECT
          *
        FROM (
          SELECT
            'survivors_disability_type' AS id,
            #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
            COUNT(*) AS total
          FROM incidents
          WHERE data @? '$[*] ? (@.disability_type == "true" && @.consent_reporting  == "true")'
          #{date_range_query(date_param)&.prepend('AND ')}
          #{equal_value_query(params['module_id'])&.prepend('AND ')}
          #{user_scope_query(current_user)&.prepend('AND ')}
          #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
          UNION
          SELECT
            data ->> 'unaccompanied_separated_status' AS id,
            #{grouped_date_query(params['grouped_by'], date_param)&.concat(' AS group_id,')}
            COUNT(*) AS total
          FROM incidents
          WHERE data @? '$[*] ? (
            @.consent_reporting  == "true" &&
            @.unaccompanied_separated_status != null &&
            @.unaccompanied_separated_status != "no"
          )'
          #{date_range_query(date_param)&.prepend('AND ')}
          #{equal_value_query(params['module_id'])&.prepend('AND ')}
          #{user_scope_query(current_user)&.prepend('AND ')}
          GROUP BY data ->> 'unaccompanied_separated_status'
          #{grouped_date_query(params['grouped_by'], date_param)&.prepend(', ')}
        ) AS survivors
        ORDER BY id
      }
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end

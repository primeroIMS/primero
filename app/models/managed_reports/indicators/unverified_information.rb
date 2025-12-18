# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the type of use of violation type Recruitment
class ManagedReports::Indicators::UnverifiedInformation < ManagedReports::SqlReportIndicator
  include ManagedReports::GhnIndicatorHelper

  class << self
    def id
      'unverified_information'
    end

    def sql(current_user, params = {})
      <<~SQL
        SELECT
          key AS name,
          'total' AS key,
          violations.data ->> 'type' as group_id,
          SUM(value::INT)
        FROM violations violations
        INNER JOIN incidents incidents
          ON incidents.id = violations.incident_id
          AND incidents.srch_status = 'open'
          AND incidents.srch_record_state = TRUE
          #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
        CROSS JOIN JSON_EACH_TEXT((violations.data->>'violation_tally')::JSON)
        WHERE violations.data @? '$[*]
          ? (exists(@.violation_tally) && @.violation_tally != null)
          ? (@.ctfmr_verified == "report_pending_verification" || @.ctfmr_verified == "reported_not_verified")
          ? (@.type != "denial_humanitarian_access" && @.type != "deprivation_liberty" && @.type != "military_use")
        '
        #{date_range_query(date_filter_param(params['ghn_date_filter']), 'incidents')&.prepend('AND ')}
        GROUP BY key, violations.data ->> 'type'
        ORDER BY name
      SQL
    end

    def date_filter
      'incident_date'
    end

    def build_results(results, params = {})
      super(results, params).map { |result| group_with_query(result, params) }
    end

    def query_for_group(group, _params)
      return [] if group[:group_id] == 'total'

      ["child_types=#{group[:group_id]}"]
    end

    def query_for_result(result, params)
      date_param = date_filter_param(params['ghn_date_filter'])
      violation_with_status = "#{result[:id]}_report_pending_verification,#{result[:id]}_reported_not_verified"
      [
        "violation_with_verification_status=#{violation_with_status}",
        date_param.to_s
      ]
    end
  end
end

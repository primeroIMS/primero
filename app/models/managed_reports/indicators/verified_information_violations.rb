# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the type of use of violation type Recruitment
class ManagedReports::Indicators::VerifiedInformationViolations < ManagedReports::SqlReportIndicator
  include ManagedReports::GhnIndicatorHelper

  class << self
    def id
      'verified_information_violations'
    end

    def sql(current_user, params = {})
      <<~SQL
        SELECT
          violations.data ->> 'type' AS id,
          COUNT(*) AS total
        FROM
          violations violations
          INNER JOIN incidents incidents ON incidents.id = violations.incident_id
          AND incidents.srch_status = 'open'
          AND incidents.srch_record_state = TRUE
          #{user_scope_query(current_user, 'incidents')&.prepend('AND ')}
        WHERE violations.data @? '$[*]
          ? (@.ctfmr_verified == "verified")
          ? (!exists(@.is_late_verification) || @.is_late_verification != true)
        '
        AND #{filter_types(Violation::GRAVE_TYPES_FOR_VIOLATION_COUNT).query}
        #{date_range_query(date_filter_param(params['ghn_date_filter']), 'violations')&.prepend('AND ')}
        GROUP BY violations.data ->> 'type'
        ORDER BY id
      SQL
    end

    def filter_violations
      SearchFilters::TextList.new(
        field_name: 'type', table_name: 'violations', values: Violation::COUNT_VIOLATION_TYPES
      )
    end

    def build_results(results, params = {})
      results.to_a.map { |result| result_with_query(result.with_indifferent_access, params) }
    end

    def query_for_result(result, params)
      date_param = date_filter_param(params['ghn_date_filter'])
      [
        "violation_with_verification_status=#{result[:id]}_verified",
        'has_late_verified_violations=false',
        date_param.to_s
      ]
    end
  end
end

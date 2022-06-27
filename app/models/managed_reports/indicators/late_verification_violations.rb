# frozen_string_literal: true

# An indicator that returns the type of use of violation type Recruitment
class ManagedReports::Indicators::LateVerificationViolations < ManagedReports::SqlReportIndicator
  include ManagedReports::GhnIndicatorHelper

  class << self
    def id
      'late_verification_violations'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      %{
        SELECT
          violations.data ->> 'type' AS id,
          COUNT(*) AS total
        FROM
          violations violations
          INNER JOIN incidents incidents ON incidents.id = violations.incident_id
          #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        WHERE
          (violations.data ->> 'type' = 'attack_on_hospitals'
          OR violations.data ->> 'type' = 'attack_on_schools'
          OR violations.data ->> 'type' = 'denial_humanitarian_access')
          and violations.data->>'is_late_verification' = 'true'
          #{date_range_query(date_filter_param(params['ghn_date_filter']), 'violations')&.prepend('and ')}
        GROUP BY
        violations.data ->> 'type'
        ORDER BY
          id
      }
    end

    def date_filter
      'ctfmr_verified_date'
    end

    def build_results(results, _params = {})
      results.to_a
    end

    # rubocop:enable Metrics/MethodLength
  end
end

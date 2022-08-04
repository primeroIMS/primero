# frozen_string_literal: true

# An indicator that returns the type of use of violation type Recruitment
class ManagedReports::Indicators::MultipleViolations < ManagedReports::SqlReportIndicator
  include ManagedReports::GhnIndicatorHelper

  class << self
    def id
      'multiple_violations'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(current_user, params = {})
      %{
        SELECT DISTINCT
          jsonb_build_object(
            'unique_id', individual_victims.data->>'unique_id',
            'incident_id', incidents.id,
            'incident_short_id', incidents.data->>'short_id',
            'individual_sex', individual_victims.data->>'individual_sex',
            'individual_age', individual_victims.data->>'individual_age',
            'violations', jsonb_agg(violations.data ->> 'type')
          ) AS data
        FROM
          violations violations
          INNER JOIN incidents incidents ON incidents.id = violations.incident_id
          INNER JOIN individual_victims_violations ON individual_victims_violations.violation_id = violations.id
          INNER JOIN individual_victims ON individual_victims.id = individual_victims_violations.individual_victim_id
        WHERE individual_victims.data->>'individual_multiple_violations' = 'true'
        #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        #{date_range_query(date_filter_param(params['ghn_date_filter']), 'violations')&.prepend('and ')}
        GROUP BY individual_victims.id, incidents.id
        #{grouped_date_query(params['grouped_by'], filter_date(params), table_name_for_query(params))&.prepend(', ')}
      }
    end

    def build_results(results, _params = {})
      results_array = results.to_a

      results_array.map do |value|
        value['data'] = JSON.parse(value['data'])
      end

      results_array
    end

    # rubocop:enable Metrics/MethodLength
  end
end
